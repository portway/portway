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
    npm run serve
    ;;
  install)
    npm install
    ;;
  *)
    exec "$@"
    ;;    
esac
