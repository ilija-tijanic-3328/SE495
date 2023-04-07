from flask import Blueprint, request

from app.service import email_service

main = Blueprint('main', __name__)


@main.route('/send', methods=['POST'])
def send():
    email_service.send(request.json)
    return "OK", 200


@main.route('/health', methods=['GET'])
def health():
    # try:
    #     TODO check mailgun ?
    # except Exception as e:
    #     app.logger.error(f'Unhealthy because: {e}')
    #     return "Error", 503

    return "OK", 200
