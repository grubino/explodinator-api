import os
import sys

import imageio
import time
from PIL import Image
from functools import reduce


def identity_frame_gen(*frames):
    for f in frames:
        yield f


class Explodinator:

    def __init__(self, fp, gen=lambda x: x):
        self._original = Image.open(fp)
        self._frames = reduce(lambda x, y: x + [self._original.copy()], range(48), [])
        self._outfp = '.'.join([os.path.splitext(fp)[0], 'gif'])
        self._gen_frames = gen

    def explodinate(self):
        filenames = []
        with imageio.get_writer(self._outfp, mode='I') as writer:
            for i, f in enumerate(self._gen_frames(self._frames)):
                _fp = "{2}/{1}__{0}".format(os.path.basename(self._outfp), i, os.path.dirname(self._outfp))
                filenames.append(_fp)
                f.save(_fp)
                writer.append_data(imageio.imread(_fp))
        return self._outfp



if __name__ == "__main__":

    if len(sys.argv) < 2:
        raise Exception("not enough arguments")

    def _randomizer_gen(frames=[]):

        for f in frames:
            mode = 'RGB'
            overlay = Image.frombytes(mode, f.size, os.urandom(f.size[0]*f.size[1]*len(mode)))
            mask = Image.frombytes('1', f.size, os.urandom(f.size[0]*f.size[1]*len(mode)))
            yield Image.composite(f, overlay, mask)

    Explodinator(sys.argv[1], _randomizer_gen).explodinate()
