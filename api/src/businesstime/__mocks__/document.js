
const getGenericMockDocumentData = () => {
  return {
    id: 2112424242,
    name: 'a real document name',
    projectId: 3
  }
}

export default {
  findParentProjectByDocumentId: jest.fn(() => getGenericMockDocumentData())
}