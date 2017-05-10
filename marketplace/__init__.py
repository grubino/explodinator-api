import os
import re

from ethereum import transactions, blocks, processblock, slogging
import serpent

from marketplace.bidstore import InMemoryBidStorage, Bid
from marketplace.bidder import BidProducer

slogging.configure_logging(config_string=os.environ.get('LOGGING_CONFIG'),
                           log_json=True,
                           log_file=os.environ.get('LOGGING_CONFIG'))


def test_contract(req):
    pass


def _bid_storage_gen(env):
    return {
        'development': lambda: InMemoryBidStorage()
    }[env]


class Marketplace:
    def __init__(self, blocks, directory='{}/../.tmp'.format(os.path.dirname(__file__))):
        self._blocks = blocks
        self._bid_producer = BidProducer()
        self._bid_doc = _bid_storage_gen(os.environ['EXPLODINATOR_ENV'])()
        self._base_dir = directory

    def bid(self, address, amount, frame0_filename):
        frame0_path = os.path.join(self._base_dir, frame0_filename)
        if os.path.exists(frame0_path) and re.match('.*\.jpe?g$'):
            self._bid_producer(Bid(contractAddr=))
        else:
            raise Exception()
