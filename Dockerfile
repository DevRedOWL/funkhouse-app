FROM node:16-alpine

WORKDIR /app

COPY package.json yarn.lock .env /app/

RUN apk update
RUN apk upgrade
RUN apk add coreutils

# Development startup
# CMD yarn && yarn run start:watch

# Production statrtup
RUN npm install pm2 -g
CMD yarn && yarn start:pm2