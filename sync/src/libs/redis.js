const Redis = require('ioredis')
const REDIS_URL = process.env.REDIS_URL
const redis = new Redis(REDIS_URL)

redis.on('connect', () => {
  console.info(`redis connected on port ${REDIS_URL}`)
})

export default redis