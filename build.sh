#!/bin/bash
set -eo pipefail

docker build -t bonkeybong/project_danger_web -f web/Dockerfile-prod web/
docker build -t bonkeybong/project_danger_api -f api/Dockerfile-prod api/