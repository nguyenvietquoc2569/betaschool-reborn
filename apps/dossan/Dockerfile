
# production environment
# FROM nginx:stable-alpine
FROM nginx
COPY dist/apps/doosan /usr/share/nginx/html
# new
COPY apps/doosan/nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 801
CMD ["nginx", "-g", "daemon off;"]