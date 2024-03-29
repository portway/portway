#!/bin/sh
set -e

echo "run.sh"

case $1 in
  start)
    npm start
    ;;
  test)
    npm run migrate
    npm test
    ;;
  devstart)
    npm run migrate
    npm run serve
    ;;
  migrate)
    npm run migrate
    ;;
  *)
    echo "$@"
    exec "$@"
    ;;
esac
