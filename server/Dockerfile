FROM python:3

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY requirements.txt /usr/src/app/

RUN pip3 install --no-cache-dir -r requirements.txt

COPY . /usr/src/app

EXPOSE 8080

ENV PYTHONPATH=/usr/src/app

CMD ["twistd", "-n", "web", "--wsgi", "app.app"]
