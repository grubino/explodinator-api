import os
import uuid

import flask
from flask import request, redirect, url_for, abort
from flask.helpers import send_from_directory
from pgmagick import Color, ImageList, Image, Blob, Geometry, CompositeOperator
from werkzeug.utils import secure_filename

from imaging.explodinator import Explodinator
from interceptors import require_appkey

ALLOWED_EXTENSIONS = {'jpg', 'jpeg'}
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '.tmp')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = flask.Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

composite_path = os.path.join(os.path.dirname(__file__), 'imaging', 'resources', 'explodinate_composite.gif')

DEFAULT_EXPLODINATION_GEOMETRY = Geometry(250, 250)

def resize(img, new_size):
    g = new_size  # distinguishes whether width, height or both given
    image = img
    sz = image.size()
    rw, rh = (sz.width(), sz.height())
    w, h = g.width(), g.height()
    if h > rh:
        g.height(int(rh * w * 1.0 / rw))
    elif w > rw:
        g.width(int(rw * h * 1.0 / rh))
    image.scale(g)
    return image

def _frame_gen(frames=(), padding=15, explodination_geometry=DEFAULT_EXPLODINATION_GEOMETRY):
    overlay_list = ImageList()
    overlay_list.readImages(composite_path)
    for _ in range(10):
        resized = resize(frames[0], explodination_geometry)
        yield resized
    for i, overlay in enumerate(overlay_list):
        if i >= len(frames):
            break
        resized = resize(frames[i], explodination_geometry)
        resizedOverlay = resize(overlay, explodination_geometry)
        resized.implode(float(i) / 5.0)
        resized.composite(resizedOverlay, 0, padding, CompositeOperator(1))
        yield resized
    for i in range(10):
        resized = resize(frames[0], explodination_geometry)
        resized.implode(float(len(overlay_list) + i) / 5.0)
        yield resized


@app.route("/health", methods=['GET'])
def health():
    return 'ok'

@app.route("/explodinate", methods=['POST'])
@require_appkey
def explodinate():
    if 'frame0.jpg' in request.files:
        f = request.files['frame0.jpg']
        fname = secure_filename(f.name)
        fpath = os.path.join(app.config['UPLOAD_FOLDER'], "-".join((str(uuid.uuid1()), fname)))
        im = Image(Blob(f.read()), Geometry(250, 250))
        im.write(fpath)
        explodinated_fpath = Explodinator(fpath, _frame_gen).explodinate()
        return redirect(url_for("explodinated", filename=os.path.basename(explodinated_fpath)))
    else:
        return abort(400)


@app.route("/explodinated/<filename>", methods=['GET'])
def explodinated(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.before_request
def before_request():
    if request.url.startswith('http://'):
        url = request.url.replace('http://', 'https://', 1)
        code = 301
        return redirect(url, code=code)

if __name__ == "__main__":
    this_dir = os.path.dirname(__file__)
    app.run(host=os.getenv("EXPLODINATOR_HOST", "0.0.0.0"),
            port=int(os.getenv("EXPLODINATOR_PORT", "8823")),
            debug=False,
            ssl_context = ('cert.pem', 'key.pem'),
            extra_files=[f for f in os.walk(this_dir) if f.endswith('.py')])
