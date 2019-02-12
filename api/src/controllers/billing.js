import billingCoordinator from '../coordinators/billing'

const billingController = function(router) {
  router.post('/', addBilling)
  router.get('/', getBilling)
}

const getBilling = async function(req, res) {
  res.json({ dog: 'billing!' })
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
