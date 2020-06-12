#!/bin/sh
# alpine only pipefail
# set -eo pipefail

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
