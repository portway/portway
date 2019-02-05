import billingCoordinator from '../coordinators/billing'

const billingController = function(router) {
  router.post('/billing', addBilling)
}

const addBilling = async function(req, res) {
  const stripeToken = req.stripeToken
  const planId = req.planId
  const email = req.email

  try {
    billingCoordinator.subscribeCustomerToPlan({
      stripeToken,
      planId,
      email
    })
  } catch(err) {
    const message = 'unable to add billing information'
    res.status(err.statusCode || 500).send(message)
  }
}

export default billingController