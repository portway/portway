const getGenericMockUserData = () => {
  return {
    id: 8675309,
    name: 'not-a real-name',
    email: 'not-a-real-email@email.com',
    orgId: 666,
    password: 'not-a-real-hashed-password',
    resetKey: 'not-a-real-reset-key'
  }
}

let findByIdReturnValue = getGenericMockUserData()

const setFindByIdReturnValue = (val) => {
  findByIdReturnValue = val
}

const resetFindByIdReturnValue = () => {
  findByIdReturnValue = getGenericMockUserData()
}

export default {
  findByEmail: jest.fn(() => getGenericMockUserData()),
  findById: jest.fn(() => findByIdReturnValue),
  updateByEmail: jest.fn(() => getGenericMockUserData()),
  updateById: jest.fn(() => getGenericMockUserData()),
  create: jest.fn(() => getGenericMockUserData()),
  setFindByIdReturnValue,
  resetFindByIdReturnValue
}