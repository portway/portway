#!/bin/sh
set -eo pipefail

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
  seeddev)
    npm run seed
    ;;
  unseeddev)
    npm run unseed-all
esac
