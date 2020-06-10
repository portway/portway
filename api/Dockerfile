
FROM node:12.18

# bcrypt and alpine linux have some issues:
# https://github.com/kelektiv/node.bcrypt.js/wiki/Installation-Instructions#alpine-linux-based-images
# RUN apk --no-cache add --virtual builds-deps build-base python

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /api

# Only copy package.json first to take advantage of docker caching
COPY package*.json ./

RUN npm install

# .dockerignore ensures not everything is copied
COPY . .

ENTRYPOINT ["/bin/sh", "./run.sh"]