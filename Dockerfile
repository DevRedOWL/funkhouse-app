FROM node:16-alpine

WORKDIR /app

COPY package.json yarn.lock .env /app/

RUN apk update
RUN apk upgrade
RUN apk add coreutils

CMD yarn && yarn run start:watch
