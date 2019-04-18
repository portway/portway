import ono from 'ono'

import { getDb } from '../db/dbConnector'
import { FIELD_TYPE_MODELS, FIELD_TYPES } from '../constants/fieldTypes'
import apiErrorTypes from '../constants/apiErrorTypes'
import resourceTypes from '../constants/resourceTypes'
import resourcePublicFields from '../constants/resourcePublicFields'
import { pick } from '../libs/utils'

const MODEL_NAME = 'Field'

const PUBLIC_FIELDS = resourcePublicFields[resourceTypes.FIELD]

const publicFields = (instance) => {
  return pick(instance, PUBLIC_FIELDS)
}

async function createForDocument(docId, body) {
  const db = getDb()
  const { orgId } = body

  validateFieldValueByType(body.value, body.type)

  const document = await db.model('Document').findOne({ where: { id: docId, orgId } })

  if (!document) {
    throw ono({ code: 404 }, `Cannot create field, document not found with id: ${docId}`)
  }

  const createdField = await document.createField(body)

  const fieldValue = await createdField.addFieldValue({
    value: body.value,
    structuredValue: body.structuredValue,
    orgId
  })

  await createdField.setFieldValue(fieldValue.id)

  return await findByIdForDocument(createdField.id, docId, orgId)
}

async function findAllForDocument(docId, orgId) {
  const db = getDb()
  const include = getFieldValueInclude(db)
  const fields = await db.model(MODEL_NAME).findAll({
    where: { docId, orgId },
    include
  })

  return fields.map(publicFields)
}

async function findByIdForDocument(id, docId, orgId) {
  const db = getDb()
  const include = getFieldValueInclude(db)

  const field = await db.model(MODEL_NAME).findOne({ where: { id, docId, orgId }, include })
  if (!field) return field

  return publicFields(field)
}

async function updateByIdForDocument(id, docId, orgId, body) {
  const db = getDb()

  const document = await db.model('Document').findOne({ where: { id: docId, orgId }, raw: true })

  if (!document) {
    throw ono({ code: 404 }, `Cannot update field, document not found with id: ${docId}`)
  }

  const field = await db.model(MODEL_NAME).findOne({ where: { id, docId, orgId } })
  if (!field) throw ono({ code: 404 }, `Cannot update, field not found with id: ${id}`)

  validateFieldValueByType(body.value, field.type)

  const updatedField = await field.update(body)
  const fieldValue = await updatedField.getFieldValue()
  await fieldValue.update({ value: body.value, structuredValue: body.structuredValue })

  return await findByIdForDocument(field.id, docId, orgId)
}

async function deleteByIdForDocument(id, docId, orgId) {
  const db = getDb()
  const field = await db.model(MODEL_NAME).findOne({ where: { id, docId, orgId } })

  if (!field) throw ono({ code: 404 }, `Cannot delete, field not found with id: ${id}`)

  await field.destroy()
}

function getFieldValueInclude(db) {
  return Object.values(FIELD_TYPE_MODELS).map((modelName) => {
    return {
      model: db.model(modelName)
    }
  })
}

function validateFieldValueByType(fieldValue, type) {
  let isValid = false

  // we're allowing null or undefined values for all types
  if (fieldValue == null) return

  switch (type) {
    case FIELD_TYPES.STRING:
    case FIELD_TYPES.TEXT:
      isValid = typeof fieldValue === 'string'
      break
    case FIELD_TYPES.NUMBER:
      isValid = typeof fieldValue === 'number'
      break
  }

  if (!isValid) {
    const message = `field with type ${type} cannot have a ${typeof fieldValue} value`
    throw ono({ code: 400, message, errorType: apiErrorTypes.FieldValueIncorrectTypeError }, message)
  }
}

export default {
  createForDocument,
  updateByIdForDocument,
  findByIdForDocument,
  findAllForDocument,
  deleteByIdForDocument
}
