from typing import Tuple, Iterable

from pgmagick import Geometry, ImageList, CompositeOperator, Image, GravityType, DrawableList
import os

from pgmagick.api import Draw

composite_path = os.path.join(os.path.dirname(__file__), 'resources', 'explodinate_composite.gif')

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


def place_meme_text(meme_text_tup: Iterable[Tuple[str, Tuple[int, int]]], image: Image):
    for meme_text, meme_text_pos in meme_text_tup:
        x, y = meme_text_pos
        draw_api = Draw()
        draw_api.gravity(GravityType.CenterGravity)
        draw_api.font('Impact', weight='bold')
        draw_api.pointsize(24)
        draw_api.stroke_color('black')
        draw_api.fill_color('white')
        draw_api.text(x, y, meme_text)
        image.draw(draw_api.drawer)


def default_frame_gen(frames=(),
                      padding=15,
                      meme_text_tup=()):
    overlay_list = ImageList()
    overlay_list.readImages(composite_path)
    for _ in range(10):
        frames[0].scale('250x250')
        yield frames[0]
    for i, overlay in enumerate(overlay_list):
        if i >= len(frames):
            break
        frames[i].scale('250x250')
        overlay.scale('250x250')
        frames[i].implode(float(i) / 5.0)
        frames[i].composite(overlay, 0, padding, CompositeOperator(1))
        place_meme_text(meme_text_tup, frames[i])
        yield frames[i]
    for i in range(10):
        frames[0].scale('250x250')
        frames[0].implode(float(len(overlay_list) + i) / 5.0)
        place_meme_text(meme_text_tup, frames[0])
        yield frames[0]


