import configparser
import os
import uuid

import flask
from flask.wrappers import Response
from flask_cors import CORS
from flask import request, abort, jsonify
from flask.helpers import send_from_directory
from flask_login.utils import current_user
from flask_mongoengine import MongoEngine, Document
from flask_security.core import RoleMixin, UserMixin, Security
from flask_security.datastore import MongoEngineUserDatastore
from flask_security.utils import verify_and_update_password, login_user
from flask_security import login_required
from mongoengine.fields import StringField, BooleanField, DateTimeField, ReferenceField, ListField, URLField
from werkzeug.utils import secure_filename

from endpoints.util import create_util_endpoints
from interceptors import require_appkey
import boto3

ALLOWED_EXTENSIONS = {'jpg', 'jpeg'}
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '.tmp')
STATIC_FOLDER = os.path.join(os.path.dirname(__file__), 'static')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = flask.Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

app.config['SECRET_KEY'] = 'supers3cr3t'
app.config['SECURITY_PASSWORD_SALT'] = 's41t0fth334rth'

app.config['MONGODB_DB'] = os.environ.get('MONGODB_DB', 'explodinator')
app.config['MONGODB_HOST'] = os.environ.get('MONGODB_HOST', 'localhost')
app.config['MONGODB_PORT'] = os.environ.get('MONGODB_PORT', 27017)

db = MongoEngine(app)


class Role(db.Document, RoleMixin):
    name = db.StringField(max_length=80, unique=True)
    description = db.StringField(max_length=255)


class User(db.Document, UserMixin):
    avatar = db.URLField()
    email = db.StringField(max_length=255)
    password = db.StringField(max_length=255)
    active = db.BooleanField(default=True)
    confirmed_at = db.DateTimeField()
    roles = db.ListField(ReferenceField(Role), default=[])


class Explodination(db.Document):
    explodination = db.FileField()
    user = db.ReferenceField(User)
    likes = db.ListField(ReferenceField(User), default=[])
    shares = db.ListField(ReferenceField(User), default=[])


user_datastore = MongoEngineUserDatastore(db, User, Role)
security = Security(app, user_datastore)
security.unauthorized_handler(lambda x: abort(401))


@app.before_first_request
def create_user():
    user_datastore.create_user(email='admin@explodinator.org', password='passw0rd')


if os.path.exists('/run/secrets/aws_creds'):
    aws_config = configparser.ConfigParser()
    aws_config.read('/run/secrets/aws_creds')
    s3 = boto3.resource('s3', aws_access_key_id=aws_config['default']['aws_access_key_id'],
                        aws_secret_access_key=aws_config['default']['aws_secret_access_key'])
else:
    s3 = boto3.resource('s3')

EXPLODINATION_BUCKET = s3.Bucket('explodinations')


create_util_endpoints(app)


@app.route('/v1/login', methods=['POST'])
def login():
    body = request.json
    user = user_datastore.get_user(body.get('email', ''))
    if verify_and_update_password(body.get('password', ''), user):
        login_user(user)
        del(user.password)
        return flask.jsonify(user)
    else:
        return abort(401)


@app.route("/v1/uploadinate", methods=['POST'])
@login_required
def uploadinate():

    if 'file' in request.files:

        f = request.files['file']
        fname = secure_filename(f.name)
        fpath = os.path.join(app.config['UPLOAD_FOLDER'], ".".join(("-".join((str(uuid.uuid1()), fname)), "jpg")))
        with open(fpath, 'wb') as uploadinated_fp:
            uploadinated_fp.write(f.read())
        key = os.path.basename(fpath)

        return jsonify({'uploaded_key': key})

    return abort(400)


@app.route("/v1/uploadinations/<key>", methods=['GET'])
@login_required
def uploadinations(key):
    return send_from_directory(UPLOAD_FOLDER, key)


@app.route("/v1/explodeTexture")
@login_required
def explode_texture():
    return send_from_directory(STATIC_FOLDER, 'explosion.jpg')


@app.route("/v1/explodinations", methods=['GET'])
def explodinations():
    return jsonify(Explodination.objects.paginate(page=1, per_page=10).items)

@app.route("/v1/explodinations/<explodination_id>")
def explodination(explodination_id):
    explodination = Explodination.objects.get_or_404(id=explodination_id)
    return Response(explodination.explodination.read(), 200, content_type=explodination.explodination.content_type)

@app.route("/v1/uploadExplodination", methods=['POST'])
@login_required
def uploadExplodinations():
    new_explodination = Explodination(user=current_user.id)
    new_explodination_file = request.files['explodination']
    new_explodination.explodination.put(new_explodination_file, content_type=new_explodination_file.content_type)
    new_explodination.save()
    return jsonify(new_explodination)


@app.route("/v1/privacy", methods=['GET'])
def privacy():
    return send_from_directory(os.path.dirname(__file__), 'privacy.txt')


if __name__ == "__main__":
    app.run(host=os.getenv("EXPLODINATOR_HOST", "0.0.0.0"), port=8080, debug=False)
