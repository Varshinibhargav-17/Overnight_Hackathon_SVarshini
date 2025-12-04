from flask import Blueprint, request, jsonify
from .. import db
from ..models import User
from passlib.hash import bcrypt

users_bp = Blueprint("users", __name__)

@users_bp.route("/", methods=["GET"])
def list_users():
    """Return all users (dev-only, no pagination)"""
    users = User.query.order_by(User.id.asc()).all()
    out = []
    for u in users:
        out.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "created_at": u.created_at.isoformat()
        })
    return jsonify(out), 200


@users_bp.route("/create", methods=["POST"])
def create_user():
    """
    Create a user quickly (dev-only).
    Expected JSON: { "name": "Alice", "email": "alice@example.com", "password": "secret" }
    Stores a bcrypt-hashed password.
    """
    data = request.get_json(force=True, silent=True) or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password", "")

    if not email:
        return jsonify({"error": "email required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "user with this email already exists"}), 400

    # Hash password (store securely). If no password provided, set empty hash placeholder.
    pw_hash = bcrypt.hash(password) if password else bcrypt.hash("dev-temp-pass")

    user = User(name=name, email=email, password_hash=pw_hash)
    db.session.add(user)
    db.session.commit()

    return jsonify({"id": user.id, "email": user.email, "name": user.name}), 201
