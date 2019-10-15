import faker from 'faker'
import { getDb } from '../../dbConnector'
import constants from '../constants'

const getFieldData = function(override = {}) {
  const defaultProps = {
    name: faker.random.word(),
    orgId: constants.ORG_ID,
    documentId: faker.random.number(),
    type: 1
  }
  return { ...defaultProps, ...override }
}

const createMany = async function(numberOfFields, override) {
  const db = getDb()
  const fields = Array(numberOfFields)
    .fill()
    .map((__, index) => getFieldData({ order: index, ...override }))

  const createdFields = await Promise.all(
    fields.map(fieldData => db.model('Field').create(fieldData))
  )

  await Promise.all(
    createdFields.map(field =>
      db.model('FieldTypeStringValue').create({ fieldId: field.id, value: faker.random.word() })
    )
  )

  return createdFields
}

export default {
  createMany
}
