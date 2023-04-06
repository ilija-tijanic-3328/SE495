from flask import Blueprint, request, jsonify, abort

from app.service import auth_service

auth = Blueprint('auth', __name__)


@auth.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    access_token = auth_service.authenticate(email, password)
    return jsonify(access_token=access_token)
