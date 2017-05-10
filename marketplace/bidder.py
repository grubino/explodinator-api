import json

import pika


class BidProducer:
    def __init__(self, rabbit_host='localhost'):
        self._connection = pika.BlockingConnection(pika.ConnectionParameters(rabbit_host))
        self._channel = self._connection.channel()
        self._channel.queue_declare(queue='bids')

    def produce(self, bid):
        self._channel.basic_publish(exchange='marketplace-events',
                                    routing_key='bid-{}'.format(bid['contractAddr']),
                                    body=json.dumps(bid))

class BidConsumer:
    def __init__(self, rabbit_host='localhost', cb=lambda x: print(x)):
        self._connection = pika.BlockingConnection(pika.ConnectionParameters(rabbit_host))
        self._channel = self._connection.channel()
        self._channel.queue_declare(queue='bids')
        self._cb = cb
        self._channel.basic_consume(lambda ch, method, properties, body: self._consume(ch, method, properties, body),
                                    queue='bids', no_ack=False)

    def _consume(self, ch, method, properties, body):
        try:
            self._cb(body)
        finally:
            ch.basic_ack(delivery_tag=method.delivery_tag)