from collections import namedtuple

Bid = namedtuple('Bid', ['contractAddr', 'xplodFile', 'shareCount', 'expiry'])


class BidStorageBase:
    def put(self, bid):
        raise NotImplementedError()
    def get(self, id):
        raise NotImplementedError()
    def update(self, id, newbid):
        raise NotImplementedError()
    def delete(self, id):
        raise NotImplementedError()


class InMemoryBidStorage(BidStorageBase):
    def __init__(self):
        self._bids = {}

    def put(self, bid):
        self._bids[bid['contractAddr']] = bid

    def get(self, id):
        return self._bids.get(id, None)

    def update(self, id, newbid):
        if id == newbid.get(id, None):
            self._bids[id] = newbid
        else:
            raise Exception()

    def delete(self, id):
        del self._bids[id]

