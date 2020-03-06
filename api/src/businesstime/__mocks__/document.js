
const getGenericMockDocumentData = () => {
  return {
    id: 2112424242,
    name: 'a real document name',
    projectId: 3
  }
}

export default {
  createForProject: jest.fn(() => { return { id: 8282 } }),
  findAllForProject: jest.fn(),
  findParentProjectByDocumentId: jest.fn(() => getGenericMockDocumentData()),
  deleteByIdForProject: jest.fn(),
  deleteAllForOrg: jest.fn()
}