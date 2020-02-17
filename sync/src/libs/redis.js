const Redis = require('ioredis')
const REDIS_HOST = process.env.REDIS_HOST
const REDIS_PORT = process.env.REDIS_PORT
const redis = new Redis({host: REDIS_HOST, port: REDIS_PORT })

redis.on('connect', () => {
  console.info(`redis connected on port ${REDIS_PORT}`)
})

export default redis