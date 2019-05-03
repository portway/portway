import ono from 'ono'
import { BigNumber } from 'bignumber.js'

import { getDb } from '../db/dbConnector'
import { FIELD_TYPE_MODELS, FIELD_TYPES, MAX_NUMBER_PRECISION } from '../constants/fieldTypes'
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

  // make sure document fields are ordered correctly and get next order number for new field
  const docFieldCount = await normalizeFieldOrderAndGetCount(docId, orgId)

  const createdField = await document.createField({ ...body, order: docFieldCount })

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
    order: db.col('order'),
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

  await normalizeFieldOrderAndGetCount(docId, orgId)
}

async function updateOrderById(id, docId, orgId, newPosition) {
  const db = getDb()

  if (newPosition < 0) {
    const message = `Cannot update order, minimum order position is 0`
    throw ono({ code: 400, publicMessage: message }, message)
  }

  const field = await db.model(MODEL_NAME).findOne({ where: { id, docId, orgId } })
  if (!field) throw ono({ code: 404 }, `Cannot update order, field not found with id: ${id}`)

  const currentPosition = field.order

  // no order position change, do nothing
  if (newPosition === currentPosition) return

  const currentMax = (await normalizeFieldOrderAndGetCount(docId, orgId)) - 1

  if (newPosition > currentMax) {
    const message = `Cannot update order, the final field order position for this document is ${currentMax}`
    throw ono({ code: 409, publicMessage: message }, message)
  }

  let transaction

  try {
    transaction = await db.transaction()

    if (newPosition > currentPosition) {
      // moving to a higher order position
      await db.query(
        `UPDATE "Fields"
        SET "order" = "order" - 1
        WHERE "order" >= ${currentPosition}
        and "order" <= ${newPosition};`,
        { transaction }
      )
    } else if (newPosition < currentPosition) {
      // moving to a lower order position
      await db.query(
        `UPDATE "Fields"
        SET "order" = "order" + 1
        WHERE "order" >= ${newPosition}
        and "order" < ${currentPosition};`,
        { transaction }
      )
    }
    await db.query(
      `UPDATE "Fields"
      SET "order" = ${newPosition}
      WHERE "id" = ${id};`,
      { transaction }
    )

    await transaction.commit()
  } catch (err) {
    // Rollback transaction if any errors were encountered
    await transaction.rollback()
    throw err
  }
}

export function getFieldValueInclude(db) {
  return Object.values(FIELD_TYPE_MODELS).map((modelName) => {
    return {
      model: db.model(modelName)
    }
  })
}

function validateFieldValueByType(fieldValue, type) {
  let isValidType = false

  // we're allowing null or undefined values for all types
  if (fieldValue == null) return

  switch (type) {
    case FIELD_TYPES.STRING:
    case FIELD_TYPES.TEXT:
      isValidType = typeof fieldValue === 'string'
      break
    case FIELD_TYPES.NUMBER:
      isValidType = typeof fieldValue === 'number'
      isValidType && validateNumberPrecision(fieldValue)
      break
  }

  if (!isValidType) {
    const message = `field with type ${type} cannot have a ${typeof fieldValue} value`
    throw ono({ code: 400, message, errorType: apiErrorTypes.FieldValueIncorrectTypeError }, message)
  }
}

function validateNumberPrecision(value) {
  // validate that the number value's precision is 15 or less, allowing storage as DOUBLE
  if (BigNumber(value).precision(true) > MAX_NUMBER_PRECISION) {
    const message = `number value exceeds maximum of ${MAX_NUMBER_PRECISION} significant digits`
    throw ono({ code: 400, message, errorType: apiErrorTypes.ValidationError }, message)
  }
}

async function normalizeFieldOrderAndGetCount(docId, orgId) {
  const db = getDb()

  const docFields = await db.model(MODEL_NAME).findAll({
    where: { docId, orgId },
    order: db.col('order'),
    attributes: ['id', 'order']
  })

  const uniqueOrderVals = docFields.reduce((uniqueOrderVals, field) => {
    if (!uniqueOrderVals.includes(field.order)) return [...uniqueOrderVals, field.order]
    return uniqueOrderVals
  }, [])

  const currentMaxOrderVal = Math.max(...uniqueOrderVals)

  //verify that all doc fields have a unique order value, and that the current maximum value is correct, if so, return early
  if (docFields.length === uniqueOrderVals.length && docFields.length === currentMaxOrderVal + 1) return docFields.length

  let transaction
  try {
    transaction = await db.transaction()

    await Promise.all(docFields.map((field, index) => {
      return field.update({ order: index }, { transaction })
    }))

    await transaction.commit()
  } catch (err) {
    // Rollback transaction if any errors were encountered
    await transaction.rollback()
    throw err
  }

  return docFields.length
}

export default {
  createForDocument,
  updateByIdForDocument,
  findByIdForDocument,
  findAllForDocument,
  deleteByIdForDocument,
  updateOrderById
}
