from flask import Blueprint, request, jsonify

from app.service import auth_client

auth = Blueprint('auth', __name__)


@auth.route('/login', methods=['POST'])
def authenticate():
    data = request.json
    return jsonify(auth_client.authenticate(data))
