from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.api.decorators import current_user_required
from app.service import auth_service

auth = Blueprint('auth', __name__)


@auth.route("/login", methods=["POST"])
def login():
    email = request.json.get("email")
    password = request.json.get("password")
    response = auth_service.authenticate(email, password)
    return jsonify(response)


@auth.route("/login/two-factor", methods=["POST"])
def two_factor_login():
    token = request.json.get("token")
    code = request.json.get("code")
    response = auth_service.check_two_factor(token, code)
    return jsonify(response)


@auth.route("/register", methods=["POST"])
def register():
    auth_service.register(request.json)
    return "OK", 201


@auth.route("/confirm", methods=["PUT"])
def confirm_email():
    auth_service.confirm_email(request.json)
    return "OK", 200


@auth.route("/forgot-password", methods=["POST"])
def forgot_password():
    auth_service.forgot_password(request.json)
    return "OK", 200


@auth.route("/reset-password", methods=["PUT"])
def reset_password():
    auth_service.reset_password(request.json)
    return "OK", 200


@auth.route("/reset-password/validate", methods=["POST"])
def validate_reset_password_token():
    auth_service.validate_reset_password_token(request.json)
    return "OK", 200


@auth.route("/change-password", methods=["PUT"])
@current_user_required()
def change_password():
    auth_service.change_password(request.json)
    return "OK", 200


@auth.route("/current-user", methods=["GET"])
@jwt_required()
def current_user():
    return {"user_id": get_jwt_identity()}
