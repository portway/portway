import faker from 'faker'
import { getDb } from '../../dbConnector'
import { ORG_ID } from '../constants'
import { ORGANIZATION_ROLE_IDS } from '../../../constants/roles'

const getUserData = function(override = {}) {
  const defaultProps = {
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: faker.internet.password(),
    orgId: ORG_ID,
    orgRoleId: ORGANIZATION_ROLE_IDS.USER
  }
  return { ...defaultProps, ...override }
}

const createMany = async function(numberOfUsers, override) {
  const db = getDb()
  const users = Array(numberOfUsers).fill().map(() => getUserData(override))

  return Promise.all(users.map(userData => db.model('User').create(userData)))
}

export default {
  createMany
}