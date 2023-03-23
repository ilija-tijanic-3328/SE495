from flask import Blueprint

main = Blueprint('main', __name__)


@main.route('/health', methods=['GET'])
def health():
    # try:
    #     TODO check sendgrid ?
    # except Exception as e:
    #     app.logger.error(f'Unhealthy because: {e}')
    #     return "Error", 503

    return "OK", 200
