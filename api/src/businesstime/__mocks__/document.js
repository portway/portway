
const getGenericMockDocumentData = () => {
  return {
    id: 2112424242,
    name: 'a real document name',
    projectId: 3
  }
}

export default {
  createForProject: jest.fn(() => { return { id: 8282 } }),
  findParentProjectByDocumentId: jest.fn(() => getGenericMockDocumentData()),
  deleteAllForOrg: jest.fn()
}