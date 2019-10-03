FROM openjdk:latest

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV development

WORKDIR /docs

RUN yum install -y nodejs

# Only copy package.json first to take advantage of docker caching
COPY package*.json ./

RUN npm install -g npx
RUN npm install

# COPY . .
COPY portway-api.yaml ./

RUN npx openapi-generator generate --skip-validate-spec -i portway-api.yaml -g ruby -o /tmp/test/
