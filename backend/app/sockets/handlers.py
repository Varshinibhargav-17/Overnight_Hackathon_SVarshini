# app/sockets/handlers.py
"""
Socket.IO event handlers for real-time exam monitoring
"""
from flask import request
from app.services.anomaly_model import get_anomaly_model_service  # NEW
from flask_socketio import emit, join_room, leave_room
from app import socketio, db
from app.models import ExamSession, Event, Alert, Baseline
from app.services.risk_scorer import risk_scorer
from datetime import datetime
import json

# Store active connections
active_sessions = {}  # {session_id: {user_id, exam_id, socket_id}}


@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    print(f"Client connected: {request.sid}")
    emit('connected', {'message': 'Connected to ExamPulse AI'})


@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    print(f"Client disconnected: {request.sid}")
    
    # Remove from active sessions
    for session_id, data in list(active_sessions.items()):
        if data.get('socket_id') == request.sid:
            del active_sessions[session_id]
            break


@socketio.on('join_exam')
def handle_join_exam(data):
    """
    Student or proctor joins an exam room
    
    Data: {user_id, exam_id, role}
    """
    try:
        user_id = data.get('user_id')
        exam_id = data.get('exam_id')
        role = data.get('role', 'student')
        
        if not user_id or not exam_id:
            emit('error', {'message': 'Missing user_id or exam_id'})
            return
        
        # Join room for this exam
        room = f"exam_{exam_id}"
        join_room(room)
        
        if role == 'student':
            # Find or create exam session
            session = ExamSession.query.filter_by(
                exam_id=exam_id,
                user_id=user_id,
                status='in_progress'
            ).first()
            
            if session:
                # Store active session
                active_sessions[session.id] = {
                    'user_id': user_id,
                    'exam_id': exam_id,
                    'socket_id': request.sid,
                    'role': role
                }
                
                emit('joined_exam', {
                    'message': 'Joined exam successfully',
                    'session_id': session.id,
                    'exam_id': exam_id
                })
                
                # Notify proctors
                emit('student_joined', {
                    'user_id': user_id,
                    'exam_id': exam_id,
                    'session_id': session.id
                }, room=room, skip_sid=request.sid)
        else:
            # Proctor joined
            emit('joined_exam', {
                'message': 'Joined exam as proctor',
                'exam_id': exam_id
            })
        
    except Exception as e:
        print(f"Error in join_exam: {e}")
        emit('error', {'message': str(e)})


@socketio.on('leave_exam')
def handle_leave_exam(data):
    """Leave an exam room"""
    try:
        exam_id = data.get('exam_id')
        if exam_id:
            room = f"exam_{exam_id}"
            leave_room(room)
            emit('left_exam', {'message': 'Left exam successfully'})
    except Exception as e:
        print(f"Error in leave_exam: {e}")
        emit('error', {'message': str(e)})


@socketio.on('suspicious_activity')
def handle_suspicious_activity(data):
    """
    Log suspicious activity during exam
    
    Data: {user_id, exam_id, type, count, duration, etc.}
    """
    try:
        user_id = data.get('user_id')
        exam_id = data.get('exam_id')
        event_type = data.get('type')
        
        if not all([user_id, exam_id, event_type]):
            emit('error', {'message': 'Missing required fields'})
            return
        
        # Find active session
        session = ExamSession.query.filter_by(
            exam_id=exam_id,
            user_id=user_id,
            status='in_progress'
        ).first()
        
        if not session:
            emit('error', {'message': 'No active session found'})
            return
        
        # Determine severity
        severity = 'low'
        if event_type in ['copy_paste', 'tab_switch'] and data.get('count', 0) > 3:
            severity = 'high'
        elif event_type == 'window_blur' and data.get('duration', 0) > 30:
            severity = 'medium'
        
        # Create event
        event = Event(
            session_id=session.id,
            event_type=event_type,
            event_data=json.dumps(data),
            timestamp=datetime.utcnow(),
            severity=severity
        )
        db.session.add(event)
        
        # Update incident count
        session.flagged_incidents_count += 1
        
        # Calculate risk score
        baseline = Baseline.query.filter_by(user_id=user_id).first()
        if baseline:
            events = Event.query.filter_by(session_id=session.id).all()
            current_behavior = {
                'typing_speed_wpm': data.get('typing_speed_wpm', 0),
                'mouse_speed_pxs': data.get('mouse_speed_pxs', 0),
                'avg_question_time_sec': data.get('avg_question_time_sec', 0)
            }
            
            risk_score = risk_scorer.calculate_risk_score(
                current_behavior,
                baseline,
                events
            )
            
            session.risk_score = risk_score
            session.integrity_score = 1.0 - risk_score
            
            # Create alert if risk is high
            if risk_score > 0.7:
                alert = Alert(
                    session_id=session.id,
                    alert_type=event_type,
                    message=f"High risk activity detected: {event_type}",
                    risk_score=risk_score,
                    severity='high',
                    resolved=False
                )
                db.session.add(alert)
                
                # Notify proctors immediately
                room = f"exam_{exam_id}"
                emit('high_risk_alert', {
                    'user_id': user_id,
                    'session_id': session.id,
                    'risk_score': risk_score,
                    'event_type': event_type,
                    'message': alert.message
                }, room=room)
        
        db.session.commit()
        
        # Acknowledge to student
        emit('activity_logged', {
            'message': 'Activity logged',
            'event_type': event_type,
            'severity': severity
        })
        
        # Notify proctors
        room = f"exam_{exam_id}"
        emit('student_activity', {
            'user_id': user_id,
            'session_id': session.id,
            'event_type': event_type,
            'severity': severity,
            'risk_score': session.risk_score,
            'timestamp': datetime.utcnow().isoformat()
        }, room=room, skip_sid=request.sid)
        
    except Exception as e:
        db.session.rollback()
        print(f"Error in suspicious_activity: {e}")
        emit('error', {'message': str(e)})


@socketio.on('submit_exam')
def handle_submit_exam(data):
    """Handle exam submission via socket"""
    try:
        user_id = data.get('user_id')
        exam_id = data.get('exam_id')
        answers = data.get('answers', {})
        time_taken = data.get('time_taken')

        # NEW: optional full behavioral payload coming from frontend
        session_data = data.get('session_data')  # may be None

        # Find session
        session = ExamSession.query.filter_by(
            exam_id=exam_id,
            user_id=user_id,
            status='in_progress'
        ).first()

        if not session:
            emit('error', {'message': 'No active session found'})
            return

        # Update session basic fields
        session.submitted_at = datetime.utcnow()
        session.time_taken_seconds = time_taken
        session.answers = json.dumps(answers)
        session.status = 'submitted'

        # ---- NEW: compute model-based risk if session_data is provided ----
        if session_data:
            try:
                model_service = get_anomaly_model_service()
                risk_score, raw_score = model_service.score_session(session_data)

                session.risk_score = risk_score
                session.integrity_score = 1.0 - risk_score

                # If high risk, create alert
                if risk_score >= 0.7:
                    alert = Alert(
                        session_id=session.id,
                        alert_type='model_anomaly',
                        message=f"High risk behavior detected by model (risk={risk_score:.2f})",
                        risk_score=risk_score,
                        severity='high',
                        resolved=False
                    )
                    db.session.add(alert)

                    room = f"exam_{exam_id}"
                    emit('high_risk_alert', {
                        'user_id': user_id,
                        'session_id': session.id,
                        'exam_id': exam_id,
                        'risk_score': risk_score,
                        'event_type': 'model_anomaly',
                        'message': alert.message
                    }, room=room)

                # Also push generic risk_update for dashboard
                room = f"exam_{exam_id}"
                emit('risk_update', {
                    'user_id': user_id,
                    'session_id': session.id,
                    'exam_id': exam_id,
                    'risk_score': session.risk_score,
                    'integrity_score': session.integrity_score,
                    'raw_score': raw_score,
                    'timestamp': datetime.utcnow().isoformat()
                }, room=room)

            except Exception as model_err:
                # Don't block submission if model fails — just log
                print(f"Error scoring session with anomaly model: {model_err}")

        db.session.commit()

        # Remove from active sessions
        if session.id in active_sessions:
            del active_sessions[session.id]

        emit('exam_submitted', {
            'message': 'Exam submitted successfully',
            'session_id': session.id
        })

        # Notify proctors
        room = f"exam_{exam_id}"
        emit('student_submitted', {
            'user_id': user_id,
            'session_id': session.id,
            'exam_id': exam_id
        }, room=room)

    except Exception as e:
        db.session.rollback()
        print(f"Error in submit_exam: {e}")
        emit('error', {'message': str(e)})


@socketio.on('get_active_students')
def handle_get_active_students(data):
    """Get list of active students in an exam (proctor only)"""
    try:
        exam_id = data.get('exam_id')
        
        if not exam_id:
            emit('error', {'message': 'Missing exam_id'})
            return
        
        # Get all active sessions for this exam
        sessions = ExamSession.query.filter_by(
            exam_id=exam_id,
            status='in_progress'
        ).all()
        
        active_students = []
        for session in sessions:
            if session.id in active_sessions:
                student_data = {
                    'user_id': session.user_id,
                    'session_id': session.id,
                    'risk_score': session.risk_score,
                    'integrity_score': session.integrity_score,
                    'incidents_count': session.flagged_incidents_count,
                    'started_at': session.started_at.isoformat()
                }
                
                # Add user info
                if session.student:
                    student_data['name'] = session.student.name
                    student_data['roll_number'] = session.student.roll_number
                
                active_students.append(student_data)
        
        emit('active_students', {
            'exam_id': exam_id,
            'students': active_students,
            'count': len(active_students)
        })
        
    except Exception as e:
        print(f"Error in get_active_students: {e}")
        emit('error', {'message': str(e)})
