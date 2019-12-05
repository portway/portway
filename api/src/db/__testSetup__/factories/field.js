import faker from 'faker'
import { getDb } from '../../dbConnector'
import constants from '../constants'
import { FIELD_TYPES, FIELD_TYPE_MODELS } from '../../../constants/fieldTypes'

const getFieldData = function(override = {}) {
  const defaultProps = {
    name: faker.random.word(),
    orgId: constants.ORG_ID,
    documentId: faker.random.number(),
    type: 1
  }
  return { ...defaultProps, ...override }
}

const createMany = async function(numberOfFields, override = {} ) {
  // default to a number field
  const type = override.type || FIELD_TYPES.STRING
  const model = FIELD_TYPE_MODELS[type]
  let value = override.value

  if (!value) {
    switch (type) {
      case FIELD_TYPES.STRING:
      case FIELD_TYPES.TEXT:
      case FIELD_TYPES.IMAGE:
        value = faker.random.word()
        break
      case FIELD_TYPES.NUMBER:
        value = faker.random.number()
        break
    }
  }

  const db = getDb()
  const fields = Array(numberOfFields)
    .fill()
    .map((__, index) => getFieldData({ order: index, ...override }))

  const createdFields = await Promise.all(
    fields.map(fieldData => db.model('Field').create(fieldData))
  )

  await Promise.all(
    createdFields.map((field) => {
      return db.model(model).create({ fieldId: field.id, value })
    })
  )

  return createdFields
}

export default {
  createMany
}
