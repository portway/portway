#!/bin/bash
set -eo pipefail

case $1 in
  start)
    npm start
    ;;
  test)
    npm test
    ;;
  devbuild)
    npm install
    ;;
  devstart)
    npm run serve
    ;;
esac
