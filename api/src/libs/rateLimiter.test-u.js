import rateLimiter, { REQ_LIMIT } from './rateLimiter'

const key = 'testkey'

describe('rateLimiter', () => {
  it('should rate limit', async () => {
    let requestOK = true
    for (let i = 0; i <= REQ_LIMIT; i++) {
      requestOK = await rateLimiter(key)
      if ((i > REQ_LIMIT - 1)) {
        expect(requestOK).toBe(false)
      } else {
        expect(requestOK).toBe(true)
      }
    }
  })
})
