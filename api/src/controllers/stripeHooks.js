import stripeEventCoordinator from '../coordinators/stripeEvent'

const stripeHooks = function(router) {
  // all routes are nested at stripehooks
  router.post(
    '/',
    handleStripeEvent
  )
}

const handleStripeEvent = async function(req, res, next) {
  const { body: event } = req
  console.log(event)
  try {
    stripeEventCoordinator.handleEvent(event)
    res.status(204).send()
  } catch (e) {
    next(e)
  }
}

export default stripeHooks
