#!/bin/sh
set -e

echo "run.sh"

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