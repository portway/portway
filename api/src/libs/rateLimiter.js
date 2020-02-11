import SlidingWindowRateLimiter from 'sliding-window-rate-limiter'
import IORedis from 'ioredis'
/*
## check(key, limit)
const result = await limiter.check(key, limit)
const {usage, reset} = result

remaining = limit - usage

## reserve(key, token)
const result = await limiter.reserve(key, limit)
const {token, usage, reset} = result
*/

export const REQ_LIMIT = 200
const TIME_INTERVAL_MS = 60000 // 1 min

const options = {
  interval: TIME_INTERVAL_MS
}

if (process.env.REDIS_URL) {
  // sliding-window-rate-limiter is supposed to take a url to redis, but
  // it doesn't seem to work. Much safer to just pass an ioredis instance
  const redis = new IORedis(process.env.REDIS_URL)
  options.redis = redis
}

const limiter = SlidingWindowRateLimiter.createLimiter(options)

/**
 * Rate limits based off the input key
 * @param {String} key
 * @return {Boolean} true if request has not exceeded rate limit, otherwise false
 */
export default async function rateLimit(key) {
  const result = await limiter.reserve(key, REQ_LIMIT)
  // token is only issued if there's available usage
  return Boolean(result.token)
}

