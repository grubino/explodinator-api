from pgmagick import Geometry, ImageList, CompositeOperator
import os

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


def default_frame_gen(frames=(), padding=15, explodination_geometry=DEFAULT_EXPLODINATION_GEOMETRY):
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


