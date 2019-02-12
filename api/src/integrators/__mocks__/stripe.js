export default {
  createCustomer: jest.fn(() => {
    return {
      userId: 'test-user-id'
    }
  }),
  createSubscription: jest.fn(() => {
    return {}
  })
}