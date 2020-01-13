let findByIdReturnValue

export default {
  createForDocument: jest.fn(),
  updateByIdForDocument: jest.fn(),
  findByIdForDocument: jest.fn(() => findByIdReturnValue),
  setFindByIdReturnValue: (returnValue) => {
    findByIdReturnValue = returnValue
  },
  resetFindByIdReturnValue: () => { findByIdReturnValue = undefined },
  deleteAllForOrg: jest.fn()
}
