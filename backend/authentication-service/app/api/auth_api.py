from flask import Blueprint, request, jsonify

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
