import flask
from werkzeug.utils import redirect


def create_util_endpoints(app):

    @app.route("/v1/favicon.ico")
    def favicon():
        return redirect('/web/favicon.ico')

    @app.route("/v1/health", methods=['GET'])
    def health():
        return flask.Response()

