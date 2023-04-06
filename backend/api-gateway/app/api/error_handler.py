from flask import jsonify, current_app as app
from werkzeug.exceptions import HTTPException


@app.errorhandler(HTTPException)
def generic_error_handler(error):
    return jsonify({'error': error.description}), error.code
