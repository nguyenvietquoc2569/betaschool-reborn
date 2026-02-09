FROM docker.io/nginx:latest as nginx

LABEL maintainer="NGINX Packaging <nginx-packaging@f5.com>"

# Keep the nginx logs inside the container
RUN unlink /var/log/nginx/access.log \
    && unlink /var/log/nginx/error.log \
    && touch /var/log/nginx/access.log \
    && touch /var/log/nginx/error.log \
    && chown nginx /var/log/nginx/*log \
    && chmod 644 /var/log/nginx/*log
COPY apps/dnsserver/nginx /etc/nginx

COPY apps/dnsserver/entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]