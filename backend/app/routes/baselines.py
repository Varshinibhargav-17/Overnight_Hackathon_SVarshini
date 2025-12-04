from flask import Blueprint, request, jsonify, current_app
from .. import db
from ..models import Baseline
from ..services.baseline_utils import merge_baseline

baselines_bp = Blueprint("baselines", __name__)

@baselines_bp.route("/", methods=["GET"])
def list_baselines():
    items = Baseline.query.order_by(Baseline.id.asc()).all()
    out = []
    for b in items:
        out.append({
            "id": b.id,
            "user_id": b.user_id,
            "features": b.features,
            "sample_count": b.sample_count,
            "created_at": b.created_at.isoformat(),
            "updated_at": b.updated_at.isoformat() if b.updated_at else None
        })
    return jsonify(out), 200


@baselines_bp.route("/<int:user_id>", methods=["GET"])
def get_baseline(user_id):
    b = Baseline.query.filter_by(user_id=user_id).first()
    if not b:
        return jsonify({"error": "baseline-not-found"}), 404
    return jsonify({
        "id": b.id,
        "user_id": b.user_id,
        "features": b.features,
        "sample_count": b.sample_count,
        "created_at": b.created_at.isoformat(),
        "updated_at": b.updated_at.isoformat() if b.updated_at else None
    }), 200


@baselines_bp.route("/create", methods=["POST"])
def create_baseline():
    """
    Create a baseline.
    Expected JSON:
    {
      "user_id": 123,
      "features": { "wpm_mean": 45.2, "tab_switch_rate": 0.02, "mouse_speed_mean": 120.5 }
    }
    """
    data = request.get_json(force=True, silent=True) or {}
    user_id = data.get("user_id")
    features = data.get("features")
    if user_id is None or features is None:
        return jsonify({"error": "user_id and features required"}), 400

    if Baseline.query.filter_by(user_id=user_id).first():
        return jsonify({"error": "baseline-already-exists"}), 400

    b = Baseline(user_id=user_id, features=features, sample_count=1)
    db.session.add(b)
    db.session.commit()
    return jsonify({"id": b.id, "user_id": b.user_id}), 201


@baselines_bp.route("/<int:user_id>/merge", methods=["POST"])
def merge_sample_into_baseline(user_id):
    """
    Merge a new sample (from a practice test) into an existing baseline using incremental averaging.
    Expected JSON:
    {
      "features": { "wpm_mean": 50.0, "tab_switch_rate": 0.01, ... }
    }
    """
    data = request.get_json(force=True, silent=True) or {}
    new_features = data.get("features")
    if new_features is None:
        return jsonify({"error": "features required"}), 400

    b = Baseline.query.filter_by(user_id=user_id).first()
    if not b:
        # if no baseline exists, create one
        b = Baseline(user_id=user_id, features=new_features, sample_count=1)
        db.session.add(b)
        db.session.commit()
        return jsonify({"status": "created", "id": b.id}), 201

    try:
        merged_features = merge_baseline(b.features, new_features, b.sample_count)
        b.features = merged_features
        b.sample_count = b.sample_count + 1
        db.session.add(b)
        db.session.commit()
        return jsonify({"status": "merged", "id": b.id, "sample_count": b.sample_count}), 200
    except Exception as e:
        current_app.logger.exception("merge error")
        return jsonify({"error": "merge-failed", "details": str(e)}), 500
