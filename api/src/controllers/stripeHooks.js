import stripeEventCoordinator from '../coordinators/stripeEvent'
import stripeIntegrator from '../integrators/stripe'
import ono from 'ono'

const stripeHooks = function(router) {
  // all routes are nested at stripehooks
  router.post(
    '/',
    checkEventSignature,
    handleStripeEvent
  )
}

const checkEventSignature = function(req, res, next) {
  const signature = req.headers['stripe-signature']
  try {
    req.event = stripeIntegrator.constructWebhookEvent(req.body, signature)
    next()
  } catch (err) {
    throw ono({ status: 401, publicMessage: 'Unauthorized' }, err.message)
  }
}

const handleStripeEvent = async function(req, res, next) {
  const { event } = req

  try {
    await stripeEventCoordinator.handleEvent(event)
    res.status(204).send()
  } catch (e) {
    next(e)
  }
}

export default stripeHooks
