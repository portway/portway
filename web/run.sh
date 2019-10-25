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
  local)
    npm run build && API_PUBLIC_URL=http://localhost:3001 API_URL=http://localhost:3001 JWT_SECRET=jwtauthsecret NODE_ENV=production node dist/server/app.js
    ;;
  install)
    npm install
    ;;
  *)
    exec "$@"
    ;;
esac
