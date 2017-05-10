FROM ubuntu:latest

RUN mkdir -p /app
WORKDIR /app
ADD . .
RUN apt-get update && apt-get install -y libssl-dev pkg-config libffi-dev libgraphicsmagick++1-dev libboost-python-dev python-pgmagick python3-pip git && pip3 install -r requirements.txt

CMD ["python3", "app.py"]