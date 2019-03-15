import faker from 'faker'
import { getDb } from '../../dbConnector'

const getUserData = function(override = {}) {
  const defaultProps = {
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: faker.internet.password()
  }
  return { ...defaultProps, ...override }
}

const createMany = async function(numberOfUsers, override) {
  const db = getDb()
  const users = Array(numberOfUsers).fill(numberOfUsers).map(() => getUserData(override))

  return Promise.all(users.map(userData => db.model('User').create(userData)))
}

export default {
  createMany
}