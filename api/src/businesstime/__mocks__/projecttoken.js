const getGenericMockTokenData = () => {
  return {
    id: 8675309,
    name: 'project token',
    token: 'asdfasedf;h23234234l2k3423aadsf/.asdfhjkn232',
    projectId: 1,
    roleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

export default {
  create: jest.fn(() => getGenericMockTokenData()),
  findById: jest.fn(() => getGenericMockTokenData()),
  findByIdUnsanitized: jest.fn(() => {
    return { ...getGenericMockTokenData(), secret: 'abc123' }
  }),
  addTokenStringById: jest.fn(() => getGenericMockTokenData())
}