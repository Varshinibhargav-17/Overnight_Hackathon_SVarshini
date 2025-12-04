# app/sockets/handlers.py
from flask import current_app
from app import socketio, db
from app.models import Event, Alert, Baseline
from app.services.risk_engine import compute_risk_score
from flask_socketio import join_room, leave_room
import traceback

# client emits: socket.emit("join_exam", {"user_id": 1, "exam_id": 10, "role": "student"/"proctor"})
@socketio.on("join_exam")
def handle_join(data):
    try:
        user_id = data.get("user_id")
        exam_id = data.get("exam_id")
        role = data.get("role", "student")
        if not user_id or not exam_id:
            socketio.emit("joined", {"status": "error", "reason": "missing user_id or exam_id"})
            return
        # room naming: per-exam proctors, per-exam-user
        user_room = f"exam_{exam_id}_user_{user_id}"
        proctor_room = f"exam_{exam_id}_proctors"
        join_room(user_room)
        if role == "proctor":
            join_room(proctor_room)
        socketio.emit("joined", {"status": "ok", "user_room": user_room, "proctor_room": proctor_room})
    except Exception:
        current_app.logger.exception("join_exam error")
        socketio.emit("joined", {"status": "error", "reason": "server-error"})

# client emits: socket.emit("behavior_event", {user_id, exam_id, event_type, payload})
@socketio.on("behavior_event")
def handle_behavior_event(data):
    """
    Persist event, compute risk, optionally create alert and emit to proctors.
    """
    try:
        # Basic validation/coercion
        user_id = int(data.get("user_id"))
        exam_id = int(data.get("exam_id"))
        event_type = str(data.get("event_type", "unknown"))
        payload = data.get("payload", {}) or {}

        # Persist event to DB
        ev = Event(user_id=user_id, exam_id=exam_id, event_type=event_type, payload=payload)
        db.session.add(ev)
        db.session.commit()

        # Run risk engine (uses baseline if available)
        try:
            baseline = Baseline.query.filter_by(user_id=user_id).first()
        except Exception:
            baseline = None

        # compute_risk_score should return float between 0 and 1 and a dictionary of reasons/metrics
        risk_score, reasons = compute_risk_score(event_type, payload, baseline)

        # Emit lightweight ack to the client
        user_room = f"exam_{exam_id}_user_{user_id}"
        socketio.emit("event_received", {"status": "ok", "event_id": ev.id, "risk": risk_score}, to=user_room)

        # If risk passes threshold, create Alert and notify proctors
        WARNING_THRESHOLD = 0.5
        FLAG_THRESHOLD = 0.7

        if risk_score >= WARNING_THRESHOLD:
            alert = Alert(user_id=user_id, exam_id=exam_id, risk_score=risk_score,
                          reason=";".join(reasons.get("reasons", [])) if reasons else "rule-trigger",
                          meta={"event_type": event_type, "payload": payload, "reasons": reasons})
            db.session.add(alert)
            db.session.commit()

            proctor_room = f"exam_{exam_id}_proctors"
            payload_out = {
                "alert_id": alert.id,
                "user_id": user_id,
                "exam_id": exam_id,
                "risk_score": float(risk_score),
                "reason": alert.reason,
                "meta": alert.meta
            }
            # emit to proctors only
            socketio.emit("alert", payload_out, to=proctor_room)

    except Exception:
        # rollback if needed and log
        try:
            db.session.rollback()
        except Exception:
            pass
        current_app.logger.error("Error handling behavior_event:\n" + traceback.format_exc())
        socketio.emit("event_received", {"status": "error", "error": "server-error"})
