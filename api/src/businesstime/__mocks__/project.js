
const getGenericMockProjectData = () => {
  return {
    id: 2112424244,
    name: 'a real document name',
    description: 'this is the story of a product'
  }
}

export default {
  findById: jest.fn(() => getGenericMockProjectData())
}