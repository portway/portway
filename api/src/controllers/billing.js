import billingCoordinator from '../coordinators/billing'
import Joi from 'joi'
import validate from '../libs/payloadValidation'

const billingPayloadSchema = Joi.compile({
  body: Joi.object().keys({
    token: Joi.string().required(),
    planId: Joi.string().required(),
    email: Joi.string().email().required()
  })
})

const billingController = function(router) {
  router.post(
    '/billing',
    validate(billingPayloadSchema),
    addBilling
  )

  router.get('/', getBilling)
}

const getBilling = async function(req, res) {
  res.json({ billing: 'loaded' })
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
