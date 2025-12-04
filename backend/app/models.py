# app/models.py
from . import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSONB

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=True)
    email = db.Column(db.String(200), unique=True, nullable=False)
    roll_number = db.Column(db.String(100), nullable=True)
    course = db.Column(db.String(200), nullable=True)
    accommodations = db.Column(JSONB, nullable=True)   # e.g. {"needs_extra_time": True}
    extra = db.Column(JSONB, nullable=True)            # was 'metadata' — renamed to 'extra'
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<User id={self.id} email={self.email} name={self.name}>"
class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Alert(db.Model):
    __tablename__ = 'alerts'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text)
    severity = db.Column(db.String(50))  # e.g., 'low', 'medium', 'high'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Baseline(db.Model):
    __tablename__ = "baselines"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), index=True, nullable=False)
    features = db.Column(JSONB, nullable=False)   # e.g. {"wpm_mean": 45, "tab_switch_rate": 0.01}
    sample_count = db.Column(db.Integer, default=1, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<Baseline id={self.id} user={self.user_id} samples={self.sample_count}>"
