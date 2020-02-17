
FROM node:12.13.0-alpine

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /sync

# Only copy package.json first to take advantage of docker caching
COPY package*.json ./

RUN npm install

# .dockerignore ensures not everything is copied
COPY . .

ENTRYPOINT ["/bin/sh", "./run.sh"]