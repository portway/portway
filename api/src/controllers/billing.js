import billingCoordinator from '../coordinators/billing'
import Joi from 'joi'
import { validateBody } from '../libs/middleware/payloadValidation'

const billingPayloadSchema = Joi.compile({
  body: Joi.object().keys({
    token: Joi.string().required(),
    planId: Joi.string().required(),
    email: Joi.string()
      .email()
      .required()
  })
})

const billingController = function(router) {
  router.post('/billing', validateBody(billingPayloadSchema), addBilling)

  router.get('/', getBilling)
}

const getBilling = async function(req, res) {
  res.json({ billing: true })
}

const addBilling = async function(req, res, next) {
  const { token, planId, email } = req.body

  try {
    await billingCoordinator.subscribeCustomerToPlan({
      token,
      planId,
      email
    })

    res.send('successfully subscribed user to plan')
  } catch (e) {
    next(e)
  }
}

export default billingController
