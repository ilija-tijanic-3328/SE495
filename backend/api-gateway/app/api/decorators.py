from functools import wraps

from flask import request, abort, g

from app.service import auth_client


def jwt_required(optional: bool = False, role=None):
    def wrapper(func):
        @wraps(func)
        def decorator(*args, **kwargs):
            jwt_header = request.headers.get('Authorization')
            if jwt_header is not None:
                try:
                    user = auth_client.get_current_user(jwt_header)
                    g.current_user_id = user.get('id')
                    g.current_user_role = user.get('role')

                    if role and role != g.current_user_role:
                        abort(403)
                except:
                    abort(401)
            else:
                if not optional:
                    abort(401)
            return func(*args, **kwargs)

        return decorator

    return wrapper
