from functools import wraps

from flask import request, abort, g


def current_user_required():
    def wrapper(func):
        @wraps(func)
        def decorator(*args, **kwargs):
            current_user_id = request.headers.get('current_user_id')
            if current_user_id is not None:
                g.current_user_id = current_user_id
            else:
                abort(401)
            return func(*args, **kwargs)

        return decorator

    return wrapper
