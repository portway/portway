
FROM node:10.15.1

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn

ADD . web/

WORKDIR /web

RUN npm install
RUN npm rebuild node-sass
RUN npm run build
RUN rm -rf node_modules/

ENV NODE_ENV production
RUN npm install --production