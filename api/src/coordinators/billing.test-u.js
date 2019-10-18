import billingCoordinator from './billing'
import stripeIntegrator from '../integrators/stripe'
import BusinessOrganization from '../businesstime/organization'
import { PLANS, MULTI_USER_DEFAULT_SEAT_COUNT } from '../constants/plans'

jest.mock('../integrators/stripe')
jest.mock('../businesstime/organization')

describe('billing coordinator', () => {
  const orgId = 999

  describe('#subscribeOrgToPlan', () => {
    const customerId = 'not-a-real-customer-id'
    const stripeId = '1234abcd'
    const subscriptionId = 'not-a-real-subscription-id'
    const planId = PLANS.SINGLE_USER
    const subscriptionStatus = 'active'
    let mockCurrentSeatCount = 1
    const newSeatCount = 6
    let resolvedValue
    const mockSubscription = {
      id: subscriptionId,
      plan: { id: planId },
      items: { data: [{ quantity: mockCurrentSeatCount }] }
    }

    beforeAll(async () => {
      BusinessOrganization.findById.mockClear()
      BusinessOrganization.updateById.mockClear()
      BusinessOrganization.findById.mockReturnValueOnce({ stripeId })
      stripeIntegrator.getCustomer.mockClear()
      stripeIntegrator.getCustomer.mockReturnValueOnce({
        id: customerId,
        subscriptions: {
          data: [
            mockSubscription
          ]
        }
      })
      stripeIntegrator.createSubscription.mockClear()
      stripeIntegrator.createSubscription.mockImplementationOnce(() => {
        return { ...mockSubscription, status: subscriptionStatus }
      })
      resolvedValue = await billingCoordinator.subscribeOrgToPlan({ planId: PLANS.MULTI_USER, seats: newSeatCount, orgId })
    })

    it('should call BusinessOrganization.findById with the passed in org id', () => {
      expect(BusinessOrganization.findById.mock.calls.length).toBe(1)
      expect(BusinessOrganization.findById.mock.calls[0][0]).toEqual(orgId)
    })

    it('should call stripeIntegrator.getCustomer with the org stripeId', () => {
      expect(stripeIntegrator.getCustomer.mock.calls.length).toBe(1)
      expect(stripeIntegrator.getCustomer.mock.calls[0][0]).toBe(stripeId)
    })

    it('should call stripeIntegrator.createSubscription with customerId, planId, default seat count for multi-user plan, and subscription id', () => {
      expect(stripeIntegrator.createSubscription.mock.calls.length).toBe(1)
      expect(stripeIntegrator.createSubscription.mock.calls[0][0]).toEqual({
        customerId,
        planId: PLANS.MULTI_USER,
        seats: MULTI_USER_DEFAULT_SEAT_COUNT,
        subscriptionId
      })
    })

    it('should call BusinessOrganization.updateById with the org id and plan id', () => {
      expect(BusinessOrganization.updateById.mock.calls.length).toBe(1)
      expect(BusinessOrganization.updateById.mock.calls[0][0]).toEqual(orgId)
      expect(BusinessOrganization.updateById.mock.calls[0][1]).toEqual({ plan: PLANS.MULTI_USER, subscriptionStatus })
    })

    it('should resolve with undefined', () => {
      expect(resolvedValue).toBe(undefined)
    })

    describe('when there is no stripeId on the org', () => {
      it('should throw an error with status code 409 ', async () => {
        BusinessOrganization.findById.mockClear()
        await expect(billingCoordinator.subscribeOrgToPlan({ planId: PLANS.MULTI_USER, seats: newSeatCount, orgId }))
          .rejects.toEqual(expect.objectContaining({ code: 409 }))
      })
    })

    describe('when no stripe customer is found', () => {
      it('should throw an error with status code 409 ', async () => {
        stripeIntegrator.getCustomer.mockImplementationOnce(() => {})
        await expect(billingCoordinator.subscribeOrgToPlan({ planId: PLANS.MULTI_USER, seats: newSeatCount, orgId }))
          .rejects.toEqual(expect.objectContaining({ code: 409 }))
      })
    })
  })

  describe('#updateOrgBilling', () => {
    const token = 'aaa'

    beforeAll(async () => {
      BusinessOrganization.findById.mockClear()
      stripeIntegrator.createCustomer.mockClear()
      await billingCoordinator.updateOrgBilling(token, orgId)
    })

    it('should call BusinessOrganization.findById with the passed in org id', () => {
      expect(BusinessOrganization.findById.mock.calls.length).toBe(1)
      expect(BusinessOrganization.findById.mock.calls[0][0]).toEqual(orgId)
    })

    describe('when the org has a stripeId', () => {
      it('should call stripeIntegrator.updateCustomer with the stripe ID and the passed in token', async () => {
        const stripeId = '1234abcd'
        BusinessOrganization.findById.mockImplementationOnce(() => {
          return { stripeId }
        })
        await billingCoordinator.updateOrgBilling(token, orgId)
        expect(stripeIntegrator.updateCustomer.mock.calls.length).toBe(1)
        expect(stripeIntegrator.updateCustomer.mock.calls[0][0]).toBe(stripeId)
        expect(stripeIntegrator.updateCustomer.mock.calls[0][1]).toEqual({ source: token })
      })
    })

    describe('when the org does not have a stripeId', () => {
      const orgName = 'reallyGreatOrgNames'

      beforeAll(async () => {
        BusinessOrganization.updateById.mockClear()
        stripeIntegrator.createCustomer.mockClear()
        BusinessOrganization.findById.mockImplementationOnce(() => { return { name: orgName }})
        await billingCoordinator.updateOrgBilling(token, orgId)
      })

      it('should call stripeIntegrator.createCustomer with an object containing the token and org name', () => {
        expect(stripeIntegrator.createCustomer.mock.calls.length).toBe(1)
        expect(stripeIntegrator.createCustomer.mock.calls[0][0]).toEqual(expect.objectContaining({ source: token, name: orgName }))
      })

      it('should call BusinessOrganization.updateById with the org Id and a body containing the stripe customer id', () => {
        const stripeId = stripeIntegrator.updateCustomer.mock.results[0].value.id
        expect(BusinessOrganization.updateById.mock.calls.length).toBe(1)
        expect(BusinessOrganization.updateById.mock.calls[0][0]).toBe(orgId)
        expect(BusinessOrganization.updateById.mock.calls[0][1]).toEqual(expect.objectContaining({ stripeId }))
      })
    })
  })

  describe('#getOrgBilling', () => {
    let orgBilling
    const stripeId = 'some-other-stripe-id'

    beforeAll(async () => {
      stripeIntegrator.getCustomer.mockClear()
      stripeIntegrator.getCustomer.mockReturnValueOnce({
        id: 'some-stripe-customer-id',
        sources: {
          data: [{}]
        },
        subscriptions: {
          data: [
            {
              plan: { data: [{}] },
              items: { data: [{}] }
            }
          ]
        }
      })
      BusinessOrganization.findById.mockClear()
      BusinessOrganization.findById.mockReturnValueOnce({ stripeId })
      orgBilling = await billingCoordinator.getOrgBilling(orgId)
    })

    it('should call BusinessOrganization.findById with the passed in org id', () => {
      expect(BusinessOrganization.findById.mock.calls.length).toBe(1)
      expect(BusinessOrganization.findById.mock.calls[0][0]).toEqual(orgId)
    })

    it('should call stripeIntegrator.getCustomer with the orgs stripeId', () => {
      expect(stripeIntegrator.getCustomer.mock.calls.length).toBe(1)
      expect(stripeIntegrator.getCustomer.mock.calls[0][0]).toEqual(stripeId)
    })

    describe('when the organization does not have a stripe id', () => {
      beforeAll(async () => {
        BusinessOrganization.findById.mockClear()
        BusinessOrganization.findById.mockImplementationOnce(() => { return {} })
        orgBilling = await billingCoordinator.getOrgBilling(orgId)
      })

      it('should return an empty object', async () => {
        expect(orgBilling).toEqual({})
      })
    })
  })
})
