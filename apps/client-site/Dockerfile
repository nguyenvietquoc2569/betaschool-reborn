
# production environment
# FROM nginx:stable-alpine
# FROM node:14
FROM nguyenvietquoc2569/node-betaschool-reborn-monorepo:latest
WORKDIR /usr/src/app
EXPOSE 3000

COPY dist/apps/client-site /usr/src/app
COPY package.json ./
RUN yarn install
# new
CMD [ "yarn", "start-client-site-prod" ]
