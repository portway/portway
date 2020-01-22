export default {
  subscribeCustomerToPlan: jest.fn(),
  createOrUpdateOrgSubscription: jest.fn(),
  getOrgBilling: jest.fn(() => {
    return {
      subscription: {
        totalSeats: 5,
        usedSeats: 1
      },
      source: {}
    }
  })
}
