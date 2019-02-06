
FROM node:10.15.1

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /web

# Only copy package.json first to take advantage of docker caching
COPY package*.json ./

RUN npm install
RUN npm rebuild node-sass

COPY . .

RUN npm run build
RUN rm -rf node_modules/

ENV NODE_ENV production
RUN npm install --only=production

ENTRYPOINT ["/bin/bash", "./run.sh"]