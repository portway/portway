import faker from 'faker'
import { getDb } from '../db-connector'

const getUserData = async(override = {}) => {
  const defaultProps = {
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: faker.internet.password
  }
  return Object.assign({}, defaultProps, override)
}

const createMany = async(numberOfUsers, override) => {
  const db = getDb()
  const users = Array(numberOfUsers).fill(numberOfUsers).map(() => getUserData(override))
  return Promise.all(users.map(userData => (new db.models.user(userData)).save()))
}

export default {
  createMany
}