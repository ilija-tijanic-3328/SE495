from flask import Blueprint, jsonify

user = Blueprint('user', __name__)

# @user.route('/', methods=['GET'])
# def get_all():
#     args = request.args
#     sort = args.get('sort', type=str)
#     search = args.get('search', type=str)
#     return jsonify(user_service.get_all(sort, search))