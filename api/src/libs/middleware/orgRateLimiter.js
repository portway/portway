import ono from 'ono'
import rateLimiter from '../rateLimiter'
import PUBLIC_MESSAGES from '../../constants/publicMessages'

// Relies on reqInfoExtractorMiddleware
// that middleware MUST run first to set orgId on the request
export default async function orgRateLimiter(req, res, next) {
  let underRateLimit = true
  try {
    underRateLimit = await rateLimiter(req.requestorInfo.orgId)
  } catch (e) {
    // TODO: log error
    return next() // let request proceed if rateLimiter is down
  }

  if (underRateLimit) {
    return next()
  } else {
    const rateLimitError = new ono(
      { code: 409, publicMessage: PUBLIC_MESSAGES.RATE_LIMIT_EXCEEDED },
      'Rate Limit Exceeded'
    )
    return next(rateLimitError)
  }
}