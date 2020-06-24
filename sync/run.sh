#!/bin/sh
set -e

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
  *)
    echo "$@"
    exec "$@"
    ;;
esac
