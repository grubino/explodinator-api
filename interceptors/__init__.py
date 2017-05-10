import os
from functools import wraps
from flask import request, abort

API_KEY = os.getenv("API_KEY", "s3cr3tp4ssw0rd")

def require_appkey(view_function):
    @wraps(view_function)
    # the new, post-decoration function. Note *args and **kwargs here.
    def decorated_function(*args, **kwargs):
        if request.args.get('key', None) == API_KEY:
            return view_function(*args, **kwargs)
        else:
            return abort(401)
    return decorated_function
