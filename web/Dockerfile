
FROM node:15.14-stretch-slim

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV development

RUN apt-get -y update
RUN apt-get -y install build-essential python

WORKDIR /web

# Only copy package.json first to take advantage of docker caching
COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT ["/bin/sh", "./run.sh"]
