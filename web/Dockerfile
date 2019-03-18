
FROM node:10.15.1-alpine

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV development

WORKDIR /web

# Only copy package.json first to take advantage of docker caching
COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT ["/bin/sh", "./run.sh"]