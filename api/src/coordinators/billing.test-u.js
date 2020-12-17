import billingCoordinator from './billing'
import stripeIntegrator from '../integrators/stripe'
import BusinessOrganization from '../businesstime/organization'
import BusinessUser from '../businesstime/user'
import { PLANS, STRIPE_STATUS, ORG_SUBSCRIPTION_STATUS, PORTWAY_PLAN_TO_STRIPE_PLAN_ID_MAP } from '../constants/plans'
import * as orgSubscription from '../libs/orgSubscription'

jest.mock('../integrators/stripe')
jest.mock('../businesstime/organization')
jest.mock('../businesstime/user')
jest.mock('../libs/orgSubscription')
// separate these internally used functions from the mock object so we can use them for their unit tests
const createOrUpdateOrgSubscription = billingCoordinator.createOrUpdateOrgSubscription
const fetchCustomerAndSetSubscriptionDataOnOrg = billingCoordinator.fetchCustomerAndSetSubscriptionDataOnOrg
billingCoordinator.createOrUpdateOrgSubscription = jest.fn()
billingCoordinator.fetchCustomerAndSetSubscriptionDataOnOrg = jest.fn()

describe('billing coordinator', () => {
  const orgId = 999

  describe('#subscribeOrgToPlan', () => {
    const customerId = 'not-a-real-customer-id'
    const stripeId = '1234abcd'
    const subscriptionId = 'not-a-real-subscription-id'
    const planId = PLANS.PER_USER
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
      resolvedValue = await billingCoordinator.subscribeOrgToPlan(PLANS.PER_USER, orgId)
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
        await expect(billingCoordinator.subscribeOrgToPlan(PLANS.PER_USER, orgId ))
          .rejects.toEqual(expect.objectContaining({ code: 409 }))
      })
    })

    describe('when no stripe customer is found', () => {
      it('should throw an error with status code 409 ', async () => {
        BusinessOrganization.findById.mockReturnValueOnce({ stripeId })
        stripeIntegrator.getCustomer.mockImplementationOnce(() => {})
        await expect(billingCoordinator.subscribeOrgToPlan(PLANS.PER_USER, orgId))
          .rejects.toEqual(expect.objectContaining({ code: 409 }))
      })
    })

    describe('when trying to change plans from per user to single user', () => {
      it('should throw an error', async () => {
        BusinessOrganization.findById.mockReturnValueOnce({ stripeId })
        stripeIntegrator.getCustomer.mockReturnValueOnce({
          id: customerId,
          subscriptions: {
            data: [{ ...mockSubscription, plan: { id: PORTWAY_PLAN_TO_STRIPE_PLAN_ID_MAP[PLANS.PER_USER] } }]
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
                plan: { id: PORTWAY_PLAN_TO_STRIPE_PLAN_ID_MAP[PLANS.PER_USER] },
                items: { data: [{ quantity: 7 }] }
              }
            ]
          }
        })
        await billingCoordinator.subscribeOrgToPlan(PLANS.PER_USER, orgId)
        expect(billingCoordinator.createOrUpdateOrgSubscription.mock.calls.length).toBe(0)
      })
    })
  })

  describe('#updatePlanSeats', () => {
    const customerId = 'not-a-real-customer-id'
    const stripeId = '1234abcd'
    const subscriptionId = 'not-a-real-subscription-id'
    const planId = PLANS.PER_USER
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

    it('should call billingCoordinator.createOrUpdateOrgSubscription with customerId, new seat count, subscription id, the PER_USER planId, and orgId', () => {
      expect(billingCoordinator.createOrUpdateOrgSubscription.mock.calls.length).toBe(1)
      expect(billingCoordinator.createOrUpdateOrgSubscription.mock.calls[0][0]).toEqual({
        orgId,
        planId: PLANS.PER_USER,
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
          billingCoordinator.subscribeOrgToPlan(PLANS.PER_USER, orgId)
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

  describe('#cancelAccount', () => {
    const customerId = 'not-a-real-customer-id'
    const stripeId = '1234abcd'
    const subscriptionId = 'not-a-real-subscription-id'
    const planId = PLANS.SINGLE_USER
    const mockCurrentSeatCount = 1
    let resolvedValue
    const mockSubscription = {
      id: subscriptionId,
      plan: { id: planId },
      items: { data: [{ quantity: mockCurrentSeatCount }] },
      status: STRIPE_STATUS.ACTIVE
    }
    const mockCustomer = {
      id: customerId,
      subscriptions: {
        data: [mockSubscription]
      }
    }

    beforeAll(async () => {
      BusinessOrganization.findById.mockClear()
      BusinessOrganization.updateById.mockClear()
      BusinessOrganization.findById.mockReturnValue({ stripeId })
      stripeIntegrator.getCustomer.mockClear()
      stripeIntegrator.getCustomer.mockReturnValue(mockCustomer)
      resolvedValue = await billingCoordinator.cancelAccount(orgId)
    })

    it('should call BusinessOrganization.findById with the passed in org id', () => {
      expect(BusinessOrganization.findById.mock.calls.length).toBe(1)
      expect(BusinessOrganization.findById.mock.calls[0][0]).toEqual(orgId)
    })

    it('should call stripeIntegrator.getCustomer with the org stripeId', () => {
      expect(stripeIntegrator.getCustomer.mock.calls.length).toBe(1)
      expect(stripeIntegrator.getCustomer.mock.calls[0][0]).toBe(stripeId)
    })

    it('should call stripeIntegrator.cancelSubscriptionAtPeriodEnd with the current subscription id', () => {
      expect(stripeIntegrator.cancelSubscriptionAtPeriodEnd.mock.calls.length).toBe(1)
      expect(stripeIntegrator.cancelSubscriptionAtPeriodEnd.mock.calls[0][0]).toBe(mockSubscription.id)
    })

    it('should call getOrgSubscriptionStatusFromStripeCustomer with the customer', async () => {
      expect(orgSubscription.getOrgSubscriptionStatusFromStripeCustomer.mock.calls.length).toBe(1)
      expect(orgSubscription.getOrgSubscriptionStatusFromStripeCustomer.mock.calls[0][0]).toBe(mockCustomer)
    })

    it('should resolve with undefined', () => {
      expect(resolvedValue).toBe(undefined)
    })

    describe('when there is no stripeId on the org', () => {
      it('should throw an error with status code 409 ', async () => {
        BusinessOrganization.findById.mockClear()
        BusinessOrganization.findById.mockReturnValueOnce({})
        await expect(
          billingCoordinator.cancelAccount(orgId)
        ).rejects.toEqual(expect.objectContaining({ code: 409 }))
      })
    })

    describe('when no stripe customer is found', () => {
      it('should throw an error with status code 409 ', async () => {
        BusinessOrganization.findById.mockReturnValueOnce({ stripeId })
        stripeIntegrator.getCustomer.mockReturnValueOnce(null)
        await expect(
          billingCoordinator.cancelAccount(orgId)
        ).rejects.toEqual(expect.objectContaining({ code: 409 }))
      })
    })

    describe('when the org has a subscriptionStatus of TRIALING', () => {
      const mockSubscription = {
        id: subscriptionId,
        plan: { id: planId },
        items: { data: [{ quantity: mockCurrentSeatCount }] },
        status: STRIPE_STATUS.TRIALING
      }

      it('should call stripeIntegrator.cancelSubscription with the current subscription id', async () => {
        stripeIntegrator.getCustomer.mockReturnValueOnce({ subscriptions: { data: [mockSubscription] } })
        orgSubscription.getOrgSubscriptionStatusFromStripeCustomer.mockReturnValueOnce(ORG_SUBSCRIPTION_STATUS.TRIALING)
        await billingCoordinator.cancelAccount(orgId)
        expect(stripeIntegrator.cancelSubscription.mock.calls.length).toBe(1)
        expect(stripeIntegrator.cancelSubscription.mock.calls[0][0]).toBe(mockSubscription.id)
      })
    })
  })

  describe('#createOrUpdateOrgSubscription', () => {
    const customerId = 'not-a-real-customer-id'
    const planId = PLANS.PER_USER
    const trialPeriodDays = 10
    const seats = 7
    const subscriptionId = 'not-a-real-subscription-id'
    const orgId = 999
    let resolvedValue

    beforeAll(async () => {
      billingCoordinator.fetchCustomerAndSetSubscriptionDataOnOrg.mockClear()
      resolvedValue = await createOrUpdateOrgSubscription({ customerId, planId, trialPeriodDays, seats, subscriptionId, orgId })
    })

    it('should call stripeIntegrator.createOrUpdateSubscription with the passed in data and endTrial: true for the PER_USER plan', async () => {
      expect(stripeIntegrator.createOrUpdateSubscription.mock.calls.length).toBe(1)
      expect(stripeIntegrator.createOrUpdateSubscription.mock.calls[0][0]).toEqual(expect.objectContaining({ customerId, planId, trialPeriodDays, seats, subscriptionId, endTrial: true }))
    })

    it('should call billingCoordinator.fetchCustomerAndSetSubscriptionDataOnOrg with the passed in org id', () => {
      expect(billingCoordinator.fetchCustomerAndSetSubscriptionDataOnOrg.mock.calls.length).toBe(1)
      expect(billingCoordinator.fetchCustomerAndSetSubscriptionDataOnOrg.mock.calls[0][0]).toBe(orgId)
    })

    it('should resolve with updated subscription', () => {
      expect(resolvedValue).toBe(stripeIntegrator.createOrUpdateSubscription.mock.results[0].value)
    })
  })

  describe('#fetchCustomerAndSetSubscriptionDataOnOrg', () => {
    const orgId = 999
    const stripeId = 'not-a-real-stripe-id'
    const customerId = 'not-a-real-customerId'
    const subscriptionId = 'not-a-real-subscription-id'
    const planId = PLANS.SINGLE_USER
    const mockCurrentSeatCount = 1
    const subscriptionStatus = STRIPE_STATUS.ACTIVE
    let resolvedValue
    const mockSubscription = {
      id: subscriptionId,
      plan: { id: planId },
      items: { data: [{ quantity: mockCurrentSeatCount }] },
      status: subscriptionStatus
    }
    const mockCustomer = {
      id: customerId,
      subscriptions: {
        data: [mockSubscription]
      }
    }


    beforeAll(async () => {
      BusinessOrganization.findById.mockClear()
      BusinessOrganization.updateById.mockClear()
      BusinessOrganization.findById.mockReturnValueOnce({ stripeId })
      BusinessOrganization.updateById.mockClear()
      stripeIntegrator.getCustomer.mockClear()
      orgSubscription.getOrgSubscriptionStatusFromStripeCustomer.mockClear()
      stripeIntegrator.getCustomer.mockReturnValueOnce(mockCustomer)
      orgSubscription.getOrgSubscriptionStatusFromStripeCustomer.mockReturnValueOnce(ORG_SUBSCRIPTION_STATUS.ACTIVE)
      resolvedValue = await fetchCustomerAndSetSubscriptionDataOnOrg(orgId)
    })

    it('should call BusinessOrganization.findById with the passed in org id', async () => {
      expect(BusinessOrganization.findById.mock.calls.length).toBe(1)
      expect(BusinessOrganization.findById.mock.calls[0][0]).toBe(orgId)
    })

    it('should call stripeIntegrator.getCustomer with the orgs stripe id', async () => {
      expect(stripeIntegrator.getCustomer.mock.calls.length).toBe(1)
      expect(stripeIntegrator.getCustomer.mock.calls[0][0]).toBe(stripeId)
    })

    it('should call getOrgSubscriptionStatusFromStripeCustomer with the customer', async () => {
      expect(orgSubscription.getOrgSubscriptionStatusFromStripeCustomer.mock.calls.length).toBe(1)
      expect(orgSubscription.getOrgSubscriptionStatusFromStripeCustomer.mock.calls[0][0]).toBe(mockCustomer)
    })

    it('should call BusinessOrganization.updateById with the org id and correct update object', async () => {
      expect(BusinessOrganization.updateById.mock.calls.length).toBe(1)
      expect(BusinessOrganization.updateById.mock.calls[0][0]).toBe(orgId)
      expect(BusinessOrganization.updateById.mock.calls[0][1]).toEqual(expect.objectContaining({ subscriptionStatus: ORG_SUBSCRIPTION_STATUS.ACTIVE, plan: planId }))
    })

    it('should resolve with undefined', async () => {
      expect(resolvedValue).toBe(undefined)
    })
  })
})
