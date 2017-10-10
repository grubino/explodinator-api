FROM nginx

COPY ./nginx /etc/nginx
COPY ./client/dist /usr/share/nginx/html
