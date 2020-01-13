import resourceTypes from '../../constants/resourceTypes'
import resourcePublicFields from '../../constants/resourcePublicFields'
import { pick } from '../../libs/utils'

const getGenericMockUserData = () => {
  return {
    id: 8675309,
    name: 'not-a real-name',
    email: 'not-a-real-email@email.com',
    orgId: 666,
    password: 'not-a-real-hashed-password',
    resetKey: 'not-a-real-reset-key',
    avatar: 'not-a-real-user-avatar'
  }
}

const PUBLIC_FIELDS = resourcePublicFields[resourceTypes.USER]

let findByIdReturnValue = getGenericMockUserData()
let findSoftDeletedReturnValue = null

const setFindByIdReturnValue = (val) => {
  findByIdReturnValue = val
}

const resetFindByIdReturnValue = () => {
  findByIdReturnValue = getGenericMockUserData()
}

const setFindSoftDeletedReturnToMockValue = () => {
  findSoftDeletedReturnValue = getGenericMockUserData()
}

const resetFindSoftDeletedReturnValue = () => {
  findSoftDeletedReturnValue = null
}

export default {
  findByEmail: jest.fn(() => getGenericMockUserData()),
  findSoftDeletedByEmail: jest.fn(() => findSoftDeletedReturnValue),
  findById: jest.fn(() => findByIdReturnValue),
  findSanitizedById: jest.fn(() => pick(findByIdReturnValue, PUBLIC_FIELDS)),
  updateByEmail: jest.fn(() => getGenericMockUserData()),
  updateById: jest.fn(() => getGenericMockUserData()),
  create: jest.fn(() => getGenericMockUserData()),
  deleteById: jest.fn(),
  restoreSoftDeleted: jest.fn(() => getGenericMockUserData),
  setFindByIdReturnValue,
  resetFindByIdReturnValue,
  setFindSoftDeletedReturnToMockValue,
  resetFindSoftDeletedReturnValue,
  countAll: jest.fn(),
  deleteAllForOrg: jest.fn()
}