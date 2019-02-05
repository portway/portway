
FROM node:10.15.1

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV production

ADD . api/

WORKDIR /api

# TODO: update with prod build
RUN npm install