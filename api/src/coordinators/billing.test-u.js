import billingCoordinator from './billing'
import stripeIntegrator from '../integrators/stripe'

jest.mock('../integrators/stripe')

describe('billing coordinator', () => {
  describe('#subscribeCustomerToPlan', () => {
    const token = 'not-a-real-token'
    const planId = 'not-a-real-plan-id'
    const email = 'test@bonkeybong.com'
    let resolvedValue

    beforeAll(async () => {
      resolvedValue = await billingCoordinator.subscribeCustomerToPlan(
        {
          token,
          planId,
          email
        }
      )
    })

    it('should call stripeIntegrator.createCustomer with the customer email and card token', () => {
      expect(stripeIntegrator.createCustomer.mock.calls.length).toBe(
        1
      )
      expect(
        stripeIntegrator.createCustomer.mock.calls[0][0]
      ).toEqual({
        email,
        token
      })
    })

    it('should call stripeIntegrator.createSubscription with the customer id and plan id', () => {
      expect(
        stripeIntegrator.createSubscription.mock.calls.length
      ).toBe(1)
      expect(
        stripeIntegrator.createSubscription.mock.calls[0][0]
      ).toEqual({
        customerId:
          stripeIntegrator.createCustomer.mock.results[0].value.id,
        planId
      })
    })

    it('should resolve with undefined', () => {
      expect(resolvedValue).toBe(undefined)
    })
  })
})
