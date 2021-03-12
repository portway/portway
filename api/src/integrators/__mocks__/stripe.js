export default {
  createCustomer: jest.fn(() => getGenericStripeCustomerData()),
  createOrUpdateSubscription: jest.fn(() => {
    return { plan: { id: 'not-a-real-plan-id' } }
  }),
  getCustomer: jest.fn(() => getGenericStripeCustomerData()),
  updateCustomer: jest.fn(() => getGenericStripeCustomerData()),
  cancelSubscription: jest.fn(),
  cancelSubscriptionAtPeriodEnd: jest.fn(),
  deleteCustomer: jest.fn()
}


const getGenericStripeCustomerData = function() {
  return {
    id: 'some-stripe-customer-id',
    sources: {
      data: [{}]
    },
    subscriptions: {
      data: [{
        plan: {
          id: '123',
          amount: '456',
          tiers: [
            {
              flat_amount: '12',
              up_to: '12'
            },
            {
              unit_amount: '123'
            }
          ]
        },
        items: { data: [{}] }
      }]
    }
  }
}
