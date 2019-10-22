export default {
  createCustomer: jest.fn(() => getGenericStripeCustomerData()),
  createSubscription: jest.fn(() => {
    return {}
  }),
  getCustomer: jest.fn(() => getGenericStripeCustomerData()),
  updateCustomer: jest.fn(() => getGenericStripeCustomerData())
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
