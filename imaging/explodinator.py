import os
import sys

import imageio
from PIL import Image, ImageSequence
from functools import reduce

class Explodinator:

    def __init__(self, fp):
        self._original = Image.open(fp)
        self._frames = reduce(lambda x, y: x + [self._original.copy()], range(48), [])
        self._outfp = '.'.join([fp.split('.')[0], 'gif'])

    def explodinate(self):
        filenames = []
        with imageio.get_writer(self._outfp, mode='I') as writer:
            for i, f in enumerate(self._frames):
                _fp = "{2}{1}__{0}".format(os.path.basename(self._outfp), i, os.path.dirname(self._outfp))
                filenames.append(_fp)
                f.save(_fp)
                writer.append_data(imageio.imread(_fp))




if __name__ == "__main__":

    if len(sys.argv) < 2:
        raise Exception("not enough arguments")

    Explodinator(sys.argv[1]).explodinate()
