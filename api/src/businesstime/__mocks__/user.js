export default {
  findByEmail: jest.fn(() => getGenericMockUserData()),
  updateByEmail: jest.fn(() => getGenericMockUserData()),
  create: jest.fn(() => getGenericMockUserData())
}

const getGenericMockUserData = () => {
  return {
    id: 8675309,
    firstName: 'not-a-real-first-name',
    lastName: 'not-a-real-last-name',
    email: 'not-a-real-email@email.com',
    orgId: 666,
    password: 'not-a-real-hashed-password',
    resetKey: 'not-a-real-reset-key'
  }
}
