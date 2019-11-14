import billingCoordinator from './billing'
import stripeIntegrator from '../integrators/stripe'
import BusinessOrganization from '../businesstime/organization'
import BusinessUser from '../businesstime/user'
import { PLANS } from '../constants/plans'

jest.mock('../integrators/stripe')
jest.mock('../businesstime/organization')
jest.mock('../businesstime/user')
billingCoordinator.createOrUpdateOrgSubscription = jest.fn()

describe('billing coordinator', () => {
  const orgId = 999

  describe('#subscribeOrgToPlan', () => {
    const customerId = 'not-a-real-customer-id'
    const stripeId = '1234abcd'
    const subscriptionId = 'not-a-real-subscription-id'
    const planId = PLANS.SINGLE_USER
    const mockCurrentSeatCount = 1
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
      resolvedValue = await billingCoordinator.subscribeOrgToPlan(PLANS.MULTI_USER, orgId)
    })

    it('should call BusinessOrganization.findById with the passed in org id', () => {
      expect(BusinessOrganization.findById.mock.calls.length).toBe(1)
      expect(BusinessOrganization.findById.mock.calls[0][0]).toEqual(orgId)
    })

    it('should call stripeIntegrator.getCustomer with the org stripeId', () => {
      expect(stripeIntegrator.getCustomer.mock.calls.length).toBe(1)
      expect(stripeIntegrator.getCustomer.mock.calls[0][0]).toBe(stripeId)
    })

    it('should resolve with undefined', () => {
      expect(resolvedValue).toBe(undefined)
    })

    describe('when there is no stripeId on the org', () => {
      it('should throw an error with status code 409 ', async () => {
        BusinessOrganization.findById.mockClear()
        await expect(billingCoordinator.subscribeOrgToPlan(PLANS.MULTI_USER, orgId ))
          .rejects.toEqual(expect.objectContaining({ code: 409 }))
      })
    })

    describe('when no stripe customer is found', () => {
      it('should throw an error with status code 409 ', async () => {
        BusinessOrganization.findById.mockReturnValueOnce({ stripeId })
        stripeIntegrator.getCustomer.mockImplementationOnce(() => {})
        await expect(billingCoordinator.subscribeOrgToPlan(PLANS.MULTI_USER, orgId))
          .rejects.toEqual(expect.objectContaining({ code: 409 }))
      })
    })

    describe('when trying to change plans from multi user to single user', () => {
      it('should throw an error', async () => {
        BusinessOrganization.findById.mockReturnValueOnce({ stripeId })
        stripeIntegrator.getCustomer.mockReturnValueOnce({
          id: customerId,
          subscriptions: {
            data: [{ ...mockSubscription, plan: { id: PLANS.MULTI_USER } }]
          }
        })
        await expect(
          billingCoordinator.subscribeOrgToPlan(PLANS.SINGLE_USER, orgId)
        ).rejects.toEqual(expect.objectContaining({ code: 409 }))
      })
    })

    describe('when plans are not changing', () => {
      it('should return early', async () => {
        billingCoordinator.createOrUpdateOrgSubscription.mockClear()
        BusinessOrganization.findById.mockReturnValueOnce({ stripeId })
        stripeIntegrator.getCustomer.mockReturnValueOnce({
          id: customerId,
          subscriptions: {
            data: [
              {
                ...mockSubscription,
                plan: { id: PLANS.MULTI_USER },
                items: { data: [{ quantity: 7 }] }
              }
            ]
          }
        })
        await billingCoordinator.subscribeOrgToPlan(PLANS.MULTI_USER, orgId)
        expect(billingCoordinator.createOrUpdateOrgSubscription.mock.calls.length).toBe(0)
      })
    })
  })

  describe('#updatePlanSeats', () => {
    const customerId = 'not-a-real-customer-id'
    const stripeId = '1234abcd'
    const subscriptionId = 'not-a-real-subscription-id'
    const planId = PLANS.MULTI_USER
    const mockCurrentSeatCount = 1
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
          data: [mockSubscription]
        }
      })
      billingCoordinator.createOrUpdateOrgSubscription.mockClear()
      billingCoordinator.createOrUpdateOrgSubscription.mockReturnValueOnce({ ...mockSubscription, items: { data: [{ quantity: newSeatCount }] } })
      BusinessUser.countAll.mockClear()
      resolvedValue = await billingCoordinator.updatePlanSeats(newSeatCount, orgId)
    })

    it('should call BusinessOrganization.findById with the passed in org id', () => {
      expect(BusinessOrganization.findById.mock.calls.length).toBe(1)
      expect(BusinessOrganization.findById.mock.calls[0][0]).toEqual(orgId)
    })

    it('should call stripeIntegrator.getCustomer with the org stripeId', () => {
      expect(stripeIntegrator.getCustomer.mock.calls.length).toBe(1)
      expect(stripeIntegrator.getCustomer.mock.calls[0][0]).toBe(stripeId)
    })

    it('should call BusinessUser.countAll with the org id', () => {
      expect(BusinessUser.countAll.mock.calls.length).toBe(1)
      expect(BusinessUser.countAll.mock.calls[0][0]).toBe(orgId)
    })

    it('should call billingCoordinator.createOrUpdateOrgSubscription with customerId, new seat count, subscription id, and orgId', () => {
      expect(billingCoordinator.createOrUpdateOrgSubscription.mock.calls.length).toBe(1)
      expect(billingCoordinator.createOrUpdateOrgSubscription.mock.calls[0][0]).toEqual({
        orgId,
        customerId,
        seats: newSeatCount,
        subscriptionId
      })
    })

    it('should resolve with the new seat count', () => {
      expect(resolvedValue).toBe(newSeatCount)
    })

    describe('when there is no stripeId on the org', () => {
      it('should throw an error with status code 409 ', async () => {
        BusinessOrganization.findById.mockClear()
        await expect(
          billingCoordinator.subscribeOrgToPlan(PLANS.MULTI_USER, orgId)
        ).rejects.toEqual(expect.objectContaining({ code: 409 }))
      })
    })

    describe('when no stripe customer is found', () => {
      it('should throw an error with status code 409 ', async () => {
        BusinessOrganization.findById.mockReturnValueOnce({ stripeId })
        stripeIntegrator.getCustomer.mockImplementationOnce(() => {})
        await expect(
          billingCoordinator.updatePlanSeats(newSeatCount, orgId)
        ).rejects.toEqual(expect.objectContaining({ code: 409 }))
      })
    })

    describe('when trying to change seat count on a single user plan', () => {
      it('should throw an error with status code 409 ', async () => {
        BusinessOrganization.findById.mockReturnValueOnce({ stripeId })
        stripeIntegrator.getCustomer.mockReturnValueOnce({
          id: customerId,
          subscriptions: {
            data: [
              {
                id: subscriptionId,
                plan: { id: PLANS.SINGLE_USER },
                items: { data: [{ quantity: 1 }] }
              }
            ]
          }
        })
        await expect(billingCoordinator.updatePlanSeats(newSeatCount, orgId))
          .rejects.toEqual(expect.objectContaining({ code: 409 }))
      })
    })

    describe('when trying to change seat count to a lower value than current user count', () => {
      it('should throw an error with status code 409 ', async () => {
        BusinessOrganization.findById.mockReturnValueOnce({ stripeId })
        BusinessUser.countAll.mockReturnValueOnce(7)
        await expect(billingCoordinator.updatePlanSeats(newSeatCount, orgId)).rejects.toEqual(
          expect.objectContaining({ code: 409 })
        )
      })
    })
  })

  describe('#updateOrgBilling', () => {
    const token = 'aaa'
    const getOrgBilling = billingCoordinator.getOrgBilling

    beforeAll(async () => {
      BusinessOrganization.findById.mockClear()
      stripeIntegrator.createCustomer.mockClear()
      billingCoordinator.getOrgBilling = jest.fn()
      await billingCoordinator.updateOrgBilling(token, orgId)
    })

    afterAll(() => {
      billingCoordinator.getOrgBilling = getOrgBilling
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

    describe('when the org does not have a current subscription', () => {
      const customerId = 'not-a-real-customer-id'

      beforeAll(async () => {
        billingCoordinator.createOrUpdateOrgSubscription.mockClear()
        stripeIntegrator.createCustomer.mockReturnValueOnce({ id: customerId, subscriptions: { data: [] } })
        await billingCoordinator.updateOrgBilling(token, orgId)
      })

      it('should call billingCoordinator.createOrUpdateOrgSubscription with the customerId, orgId, and SINGLE_USER planId', () => {
        expect(billingCoordinator.createOrUpdateOrgSubscription.mock.calls.length).toBe(1)
        expect(billingCoordinator.createOrUpdateOrgSubscription.mock.calls[0][0]).toEqual(expect.objectContaining({
          customerId,
          orgId,
          planId: PLANS.SINGLE_USER
        }))
      })
    })

    describe('when the org has a subscription, but it is not active', () => {
      const customerId = 'not-a-real-customer-id'
      const currentPlanId = 'not-a-real-plan-id'

      beforeAll(async () => {
        billingCoordinator.createOrUpdateOrgSubscription.mockClear()
        stripeIntegrator.createCustomer.mockReturnValueOnce({ id: customerId, subscriptions: { data: [{ plan: { id: currentPlanId } }] } })
        await billingCoordinator.updateOrgBilling(token, orgId)
      })

      it('should call billingCoordinator.createOrUpdateOrgSubscription with the customerId, orgId, and current plan id', () => {
        expect(billingCoordinator.createOrUpdateOrgSubscription.mock.calls.length).toBe(1)
        expect(billingCoordinator.createOrUpdateOrgSubscription.mock.calls[0][0]).toEqual(expect.objectContaining({
          customerId,
          orgId,
          planId: currentPlanId
        }))
      })
    })
  })

  describe('#getOrgBilling', () => {
    let orgBilling
    const stripeId = 'some-other-stripe-id'

    beforeAll(async () => {
      stripeIntegrator.getCustomer.mockClear()
      BusinessOrganization.findById.mockClear()
      BusinessOrganization.findById.mockReturnValueOnce({ stripeId })
      BusinessUser.countAll.mockClear()
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

    it('should call BusinessUser.countAll with the orgId', () => {
      expect(BusinessUser.countAll.mock.calls.length).toBe(1)
      expect(BusinessUser.countAll.mock.calls[0][0]).toEqual(orgId)
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
