const Redis = require('ioredis')

const REDIS_PORT = '6379'

const redis = new Redis(REDIS_PORT)

redis.on('connect', () => {
  console.log(`redis connected on port ${REDIS_PORT}`)
})

export default redis