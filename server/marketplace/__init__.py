import os
import time

from marketplace.bidder import BidProducer
from marketplace.bidstore import InMemoryBidStorage, Bid


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

    def bid(self, address, amount, key):
        self._bid_producer.produce(
            Bid(contractAddr=address, xplodKey=key, shareCount=amount, expiry=time.time() + (14 * 86400)))
