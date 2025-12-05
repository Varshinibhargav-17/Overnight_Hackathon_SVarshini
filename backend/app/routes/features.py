# app/routes/features.py
from flask import Blueprint, request, jsonify
from datetime import datetime

from app import db, socketio
from app.models import ExamSession, Alert
from app.services.anomaly_model import get_anomaly_model_service

features_bp = Blueprint("features", __name__)


@features_bp.route("/score-session", methods=["POST"])
def score_session():
    """
    Score a full behavior session using the IsolationForest model.

    Expected JSON body:
    {
        "user_id": <int>,
        "exam_id": <int>,
        "session_data": { ... }   # format described in anomaly_model.py docstring
    }
    """
    try:
        payload = request.get_json() or {}
        user_id = payload.get("user_id")
        exam_id = payload.get("exam_id")
        session_data = payload.get("session_data")

        if not user_id or not exam_id or not session_data:
            return jsonify({"error": "user_id, exam_id and session_data are required"}), 400

        # Find exam session (should already exist if student joined exam)
        session = ExamSession.query.filter_by(
            exam_id=exam_id,
            user_id=user_id,
            status="in_progress"
        ).first()

        if not session:
            # Fallback: allow scoring even if session is already marked submitted
            session = ExamSession.query.filter_by(
                exam_id=exam_id,
                user_id=user_id
            ).order_by(ExamSession.started_at.desc()).first()

        if not session:
            return jsonify({"error": "ExamSession not found for this user & exam"}), 404

        # ---- Call anomaly model ----
        model_service = get_anomaly_model_service()
        risk_score, raw_score = model_service.score_session(session_data)

        # Update session scores
        session.risk_score = risk_score
        session.integrity_score = 1.0 - risk_score
        db.session.add(session)

        # If high risk, create Alert
        alert_payload = None
        if risk_score >= 0.7:
            alert = Alert(
                session_id=session.id,
                alert_type="model_anomaly",
                message=f"Model detected high-risk behavioral pattern (risk={risk_score:.2f})",
                risk_score=risk_score,
                severity="high",
                resolved=False,
            )
            db.session.add(alert)
            alert_payload = {
                "session_id": session.id,
                "user_id": session.user_id,
                "exam_id": session.exam_id,
                "alert_type": alert.alert_type,
                "message": alert.message,
                "risk_score": risk_score,
                "severity": alert.severity,
                "created_at": datetime.utcnow().isoformat(),
            }

        db.session.commit()

        # ---- Notify proctors via Socket.IO ----
        room = f"exam_{exam_id}"

        # 1. Generic risk update for ProctorDashboard (it already listens for 'risk_update')
        socketio.emit(
            "risk_update",
            {
                "session_id": session.id,
                "user_id": session.user_id,
                "exam_id": exam_id,
                "risk_score": risk_score,
                "integrity_score": session.integrity_score,
                "raw_score": raw_score,
                "timestamp": datetime.utcnow().isoformat(),
            },
            room=room,
        )

        # 2. If high risk, send explicit alert
        if alert_payload:
            socketio.emit("student_alert", alert_payload, room=room)

        return jsonify(
            {
                "message": "Session scored successfully",
                "session_id": session.id,
                "risk_score": risk_score,
                "integrity_score": session.integrity_score,
                "raw_score": raw_score,
            }
        ), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500