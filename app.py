import os

import flask
from flask import request, redirect, url_for
from flask.helpers import send_from_directory
from werkzeug.utils import secure_filename

from imaging.explodinator import Explodinator
from PIL import Image

ALLOWED_EXTENSIONS = set(['jpg', 'jpeg'])
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '.tmp')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = flask.Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def _frame_gen(frames=[]):
    for f in frames:
        mode = 'RGB'
        overlay = Image.frombytes(mode, f.size, os.urandom(f.size[0]*f.size[1]*len(mode)))
        mask = Image.frombytes('1', f.size, os.urandom(f.size[0]*f.size[1]*len(mode)))
        yield Image.composite(f, overlay, mask)


@app.route("/explodinate", methods=['GET', 'POST'])
def explodinate():
    if request.method == 'POST' and 'frame0.jpg' in request.files:
        f = request.files['frame0.jpg']
        fname = secure_filename(f.name)
        fpath = os.path.join(app.config['UPLOAD_FOLDER'], fname)
        f.save(fpath)
        explodinated_fpath = Explodinator(fpath, _frame_gen).explodinate()
        return redirect(url_for("explodinated", filename=explodinated_fpath))


@app.route("/explodinated/<filename>")
def explodinated(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == "__main__":
    app.run(host=os.getenv("EXPLODINATOR_HOST", "0.0.0.0"),
            port=os.getenv("EXPLODINATOR_PORT", "8823"))
