from flask import Blueprint, request, jsonify

from app.service import auth_client

auth = Blueprint('auth', __name__)


@auth.route('/login', methods=['POST'])
def authenticate():
    data = request.json
    return jsonify(auth_client.authenticate(data))


@auth.route('/login/two-factor', methods=['POST'])
def authenticate_two_factor():
    data = request.json
    return jsonify(auth_client.authenticate_two_factor(data))


@auth.route('/register', methods=['POST'])
def register():
    data = request.json
    response = auth_client.register(data)
    return {"message": response.text}, response.status_code


@auth.route('/confirm', methods=['PUT'])
def confirm_email():
    data = request.json
    response = auth_client.confirm_email(data)
    return {"message": response.text}, response.status_code
