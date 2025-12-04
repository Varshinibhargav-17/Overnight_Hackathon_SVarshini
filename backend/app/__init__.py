import os
from flask import Flask
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy

# Extensions (constructed without app)
socketio = SocketIO(cors_allowed_origins="*", async_mode="eventlet")
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # Configuration (Postgres expected)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/exampulse"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # initialize extensions
    socketio.init_app(app)
    db.init_app(app)
    from .sockets import handlers

    # Root health-check
    @app.route("/")
    def index():
        return "ExamPulse backend running"

    # simple connectivity test socket
    @socketio.on("ping")
    def on_ping(data):
        print("received ping:", data)
        socketio.emit("pong", {"msg": "pong from server"})

    # Register routes (users blueprint - dev-only minimal endpoints)
    from .routes.users import users_bp
    app.register_blueprint(users_bp, url_prefix="/api/users")

    return app
