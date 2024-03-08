
# production environment
# FROM nginx:stable-alpine
# FROM node:14
FROM nguyenvietquoc2569/node-betaschool-reborn-monorepo:latest
WORKDIR /usr/src/app
ENV HOST=0.0.0.0
ENV port=3000
EXPOSE 3000

COPY dist/apps/services/ /usr/src/app
COPY package.json ./
RUN yarn install
# new
RUN mkdir tmp
CMD [ "node", "main.js" ]
