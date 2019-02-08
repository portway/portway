import billingCoordinator from './billing'
import stripeIntegrator from '../integrators/stripe'

describe('billing coordinator', () => {
  describe('#subscribeCustomerToPlan', () => {
    const token = 'not-a-real-token'
    const planId = 'not-a-real-plan-id'
    const email = 'test@bonkeybong.com'

    beforeAll(async () => {
      await billingCoordinator.subscribeCustomerToPlan({
        token,
        planId,
        email
      })
    })

    it('should call stripeIntegrator.createCustomer with the customer email and card token', () => {
      expect(stripeIntegrator.createCustomer).toHaveBeenCalledTimes(1)
      expect(stripeIntegrator.createCustomer).toHaveBeenCallWith({ email, token })
    })
  })
})