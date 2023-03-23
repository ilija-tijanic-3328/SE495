from flask import Blueprint, jsonify, request

from app.service import auth_client

auth = Blueprint('auth', __name__)


@auth.route('/authenticate', methods=['POST'])
def authenticate():
    data = request.json
    return auth_service.authenticate(data)
