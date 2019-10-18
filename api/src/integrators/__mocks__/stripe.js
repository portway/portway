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
      data: [
        {
          plan: { data: [{}] },
          items: { data: [{}] }
        }
      ]
    }
  }
}
