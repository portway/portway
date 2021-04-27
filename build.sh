#!/bin/bash
set -eo pipefail

docker build -t bonkeybong/portway_web -f web/Dockerfile-prod web/ --platform linux/amd64
docker build -t bonkeybong/portway_api -f api/Dockerfile-prod api/ --platform linux/amd64
