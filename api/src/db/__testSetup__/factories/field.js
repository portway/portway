import faker from 'faker'
import { getDb } from '../../dbConnector'
import constants from '../constants'

const getFieldData = function(override = {}) {
  const defaultProps = {
    name: faker.random.word(),
    orgId: constants.ORG_ID,
    docId: faker.random.number()
  }
  return { ...defaultProps, ...override }
}

const createMany = async function(numberOfFields, override) {
  const db = getDb()
  const fields = Array(numberOfFields).fill().map(() => getFieldData(override))

  return Promise.all(fields.map(fieldData => db.model('Field').create(fieldData)))
}

export default {
  createMany
}
