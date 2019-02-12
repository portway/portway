import billingCoordinator from '../coordinators/billing'
import auth from '../libs/auth'

const billingController = function(router) {
  router.post('/billing', auth.jwtMiddleware, addBilling)
}

const addBilling = async function(req, res) {
  const { token, planId, email } = req.body

  try {
    await billingCoordinator.subscribeCustomerToPlan({
      token,
      planId,
      email
    })

    res.send('successfully subscribed user to plan')
  } catch (err) {
    console.error(err)
    const message = 'unable to add billing information'
    res.status(err.statusCode || 500).send(message)
  }
}

export default billingController
