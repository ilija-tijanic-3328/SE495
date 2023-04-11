from functools import wraps

from flask import request, abort, g

from app.service import auth_client


def jwt_required():
    def wrapper(func):
        @wraps(func)
        def decorator(*args, **kwargs):
            jwt_header = request.headers.get('Authorization')
            if jwt_header is not None:
                user_id = auth_client.get_current_user(jwt_header)
                g.current_user_id = user_id
            else:
                abort(401)
            return func(*args, **kwargs)

        return decorator

    return wrapper
