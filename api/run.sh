#!/bin/sh
set -eo pipefail

case $1 in
  start)
    npm start
    ;;
  test)
    npm test
    ;;
  devstart)
    npm run migrate
    npm run serve
    ;;
esac
