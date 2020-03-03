
const getGenericMockProjectData = () => {
  return {
    id: 2112424244,
    name: 'a real document name',
    description: 'this is the story of a product'
  }
}

export default {
  create: jest.fn(() => { return { id: 83 } }),
  findById: jest.fn(() => getGenericMockProjectData()),
  deleteAllForOrg: jest.fn()
}