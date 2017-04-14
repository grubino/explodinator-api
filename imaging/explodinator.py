import os
import sys

from pgmagick import Image, ImageList, FilterTypes, CompositeOperator as co, Color, Geometry
from functools import reduce


def identity_frame_gen(*frames):
    for f in frames:
        yield f


class Explodinator:

    def __init__(self, fp, gen=lambda x: x, outfp=None):
        self._original = Image(fp)
        self._frames = reduce(lambda x, y: x + [Image(self._original)], range(48), [])
        self._outfp = outfp if outfp else '.'.join([os.path.splitext(fp)[0], 'gif'])
        self._gen_frames = gen

    def explodinate(self):
        out_frames = ImageList()
        for f in self._gen_frames(self._frames):
            out_frames.append(f)
        out_frames.writeImages(self._outfp)
        return self._outfp



if __name__ == "__main__":

    if len(sys.argv) < 2:
        raise Exception("not enough arguments")

    composite_path = os.path.join(os.path.dirname(__file__), 'resources', 'explodinate_composite.gif')

    def _splode_filter(frame, threshold):
        for i in range(threshold):
            frame.transparent(Color('#{06x}'.format(i)))
        return frame

    def _filter_gen(frames=[]):
        for frame in frames:
            yield _splode_filter(frame, 10)

    def _splode_gen(frames=[]):

        overlay_frames = Image(composite_path)
        for i, overlay in enumerate(ImageList(overlay_frames)):
            if i >= len(frames):
                break
            size = overlay.geometry
            f = frames[i].scaled_image(size.width(), size.height())
            f.composite(_splode_filter(overlay, 10), size)
            yield f

    Explodinator(sys.argv[1], _splode_gen).explodinate()
