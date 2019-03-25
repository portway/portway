export default {
  create: jest.fn(() => getGenericMockOrganizationData()),
  updateById: jest.fn(() => getGenericMockOrganizationData())
}

const getGenericMockOrganizationData = () => {
  return {
    id: 10101010,
    name: 'not-a-real-organization-name'
  }
}
