import faker from 'faker'
import { getDb } from '../../dbConnector'
import constants from '../constants'

const getTokenData = function(override = {}) {
  const defaultProps = {
    name: faker.random.word(),
    orgId: constants.ORG_ID,
    projectId: faker.random.number(),
    roleId: 1,
    secret: faker.internet.password(),
    token: faker.internet.password()
  }
  return { ...defaultProps, ...override }
}

const createMany = async function(numberOfTokens, override) {
  const db = getDb()
  const tokens = Array(numberOfTokens).fill().map(() => getTokenData(override))
  return Promise.all(tokens.map(tokenData => db.model('ProjectToken').create(tokenData)))
}

export default {
  createMany
}