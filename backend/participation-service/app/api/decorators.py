from functools import wraps

from flask import request, abort, g


def current_user_required(optional: bool = False):
    def wrapper(func):
        @wraps(func)
        def decorator(*args, **kwargs):
            current_user_id = request.headers.get('X-Current-User-Id')
            if current_user_id is not None:
                g.current_user_id = current_user_id
            else:
                if not optional:
                    abort(401)
            return func(*args, **kwargs)

        return decorator

    return wrapper
