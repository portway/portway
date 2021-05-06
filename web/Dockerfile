
FROM node:12.18-stretch-slim

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV development

WORKDIR /web

# Only copy package.json first to take advantage of docker caching
COPY package*.json ./

RUN npm install --target_arch=x64

COPY . .

ENTRYPOINT ["/bin/sh", "./run.sh"]
