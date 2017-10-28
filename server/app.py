import configparser
import os
import uuid

import flask
from flask_cors import CORS
from flask import request, redirect, abort, jsonify
from flask.helpers import send_from_directory
from werkzeug.utils import secure_filename

from interceptors import require_appkey
import boto3

ALLOWED_EXTENSIONS = {'jpg', 'jpeg'}
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '.tmp')
STATIC_FOLDER = os.path.join(os.path.dirname(__file__), 'static')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = flask.Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if os.path.exists('/run/secrets/aws_creds'):
    aws_config = configparser.ConfigParser()
    aws_config.read('/run/secrets/aws_creds')
    s3 = boto3.resource('s3', aws_access_key_id=aws_config['default']['aws_access_key_id'],
                        aws_secret_access_key=aws_config['default']['aws_secret_access_key'])
else:
    s3 = boto3.resource('s3')

EXPLODINATION_BUCKET = s3.Bucket('explodinations')


@app.route("/v1/favicon.ico")
def favicon():
    return redirect('/web/favicon.ico')


@app.route("/v1/health", methods=['GET'])
def health():
    return flask.Response()


def extract_meme_params(raw_meme_positions, raw_meme_text):
    meme_positions = tuple([int(x) for x in raw_meme_positions.split(',')])
    meme_text = tuple(raw_meme_text.split(','))
    return [(x, y) for x, y in zip(tuple(meme_text), zip(meme_positions[0::2], meme_positions[1::2]))
            if len(x) > 0 and len(y) > 1]


@app.route("/v1/uploadinate", methods=['POST'])
@require_appkey
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
def uploadinations(key):
    return send_from_directory(UPLOAD_FOLDER, key)


@app.route("/v1/explodeTexture")
def explode_texture():
    return send_from_directory(STATIC_FOLDER, 'explosion.jpg')


@app.route("/v1/explodinations", methods=['GET', 'POST'])
def explodinations():
    return jsonify([{'key': obj.key}
                    for obj in EXPLODINATION_BUCKET.objects.all()
                    if (obj.key.endswith('.webm')) and not obj.key.startswith('explodinate')])

@app.route("/v1/uploadExplodination", methods=['POST'])
@require_appkey
def uploadExplodinations():
    new_explodination = request.files['explodination']
    fname = secure_filename(new_explodination.name)
    explodination_key = '{}.webm'.format("-".join((str(uuid.uuid1()), fname)))
    fpath = os.path.join(app.config['UPLOAD_FOLDER'], ".".join(("-".join((str(uuid.uuid1()), fname)), "webm")))
    with open(fpath, 'wb') as uploadinated_fp:
        uploadinated_fp.write(new_explodination.read())
    s3.Object('explodinations', explodination_key).put(Body=open(fpath, 'rb'), ContentType='video/webm')
    return jsonify({'key': explodination_key})


@app.route("/v1/privacy", methods=['GET'])
def privacy():
    return send_from_directory(os.path.dirname(__file__), 'privacy.txt')


if __name__ == "__main__":
    app.run(host=os.getenv("EXPLODINATOR_HOST", "0.0.0.0"), port=8080, debug=False)
