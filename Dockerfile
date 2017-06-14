FROM nginx

COPY ./nginx/nginx.conf /etc/nginx/
COPY ./nginx/key.pem /etc/nginx/
COPY ./nginx/cert.pem /etc/nginx/