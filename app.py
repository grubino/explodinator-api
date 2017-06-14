import os
import uuid

import flask
from flask_cors import CORS
from flask import request, redirect, abort, jsonify
from flask.helpers import send_from_directory
from pgmagick import Image, Blob, Geometry
from werkzeug.utils import secure_filename

from imaging.explodinator import Explodinator
from interceptors import require_appkey
import boto3

from imaging import default_frame_gen

ALLOWED_EXTENSIONS = {'jpg', 'jpeg'}
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '.tmp')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = flask.Flask(__name__, static_url_path='/web', static_folder='./client/dist')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

s3 = boto3.resource('s3')
EXPLODINATION_BUCKET = s3.Bucket('explodinations')


@app.route("/")
def index():
    return redirect('/web/index.html')


@app.route("/favicon.ico")
def favicon():
    return redirect('/web/favicon.ico')


@app.route("/health", methods=['GET'])
def health():
    return flask.Response()


def extract_meme_params(raw_meme_positions, raw_meme_text):
    meme_positions = tuple([int(x) for x in raw_meme_positions.split(',')])
    meme_text = tuple(raw_meme_text.split(','))
    return [(x, y) for x, y in zip(tuple(meme_text), zip(meme_positions[0::2], meme_positions[1::2]))
            if len(x) > 0 and len(y) > 1]


@app.route("/explodinate", methods=['POST'])
@require_appkey
def explodinate():

    meme_layout = extract_meme_params(request.args.get('meme_pos', ''),
                                      request.args.get('meme_text', ''))
    print(meme_layout)

    if 'frame0.jpg' in request.files or 'file' in request.files:
        f = request.files.get('frame0.jpg', request.files.get('file'))
        fname = secure_filename(f.name)
        fpath = os.path.join(app.config['UPLOAD_FOLDER'], "-".join((str(uuid.uuid1()), fname)))
        im = Image(Blob(f.read()), Geometry(250, 250))
        im.scale('250x250')
        im.write(fpath)
        explodinated_fpath = Explodinator(fpath, default_frame_gen, meme_text=meme_layout).explodinate()
        key = os.path.basename(explodinated_fpath)
        with open(explodinated_fpath, 'rb') as f:
            EXPLODINATION_BUCKET.upload_fileobj(f, key, ExtraArgs={'ContentType': 'image/gif'})
        return jsonify({'key': key})
    else:
        return abort(400)


@app.route("/explodinations", methods=['GET'])
def explodinations():
    return jsonify([{'key': obj.key}
                    for obj in EXPLODINATION_BUCKET.objects.all()
                    if obj.key.endswith('.gif') and not obj.key.startswith('explodinate')])


@app.route("/privacy", methods=['GET'])
def privacy():
    return send_from_directory(os.path.dirname(__file__), 'privacy.txt')


@app.before_request
def before_request():
    if request.url.startswith('http://'):
        url = request.url.replace('http://', 'https://', 1)
        code = 301
        return redirect(url, code=code)

if __name__ == "__main__":
    this_dir = os.path.dirname(__file__)
    CORS(app)
    app.run(host=os.getenv("EXPLODINATOR_HOST", "0.0.0.0"),
            port=int(os.getenv("EXPLODINATOR_PORT", "8823")),
            debug=False,
            ssl_context = ('cert.pem', 'key.pem'),
            extra_files=[f for f in os.walk(this_dir) if f.endswith('.py')])
