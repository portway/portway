import ono from 'ono'
import { BigNumber } from 'bignumber.js'
import { Op } from 'sequelize'

import { getDb } from '../db/dbConnector'
import { FIELD_TYPE_MODELS, FIELD_TYPES, MAX_NUMBER_PRECISION } from '../constants/fieldTypes'
import apiErrorTypes from '../constants/apiErrorTypes'
import resourceTypes from '../constants/resourceTypes'
import resourcePublicFields from '../constants/resourcePublicFields'
import { pick } from '../libs/utils'
import logger from '../integrators/logger'
import { getRenderedValueByType } from '../libs/fieldRenderedValue'

const MODEL_NAME = 'Field'

const PUBLIC_FIELDS = resourcePublicFields[resourceTypes.FIELD]

const publicFields = (instance) => {
  return pick(instance, PUBLIC_FIELDS)
}

async function createForDocument(documentId, body) {
  const db = getDb()
  const { orgId } = body

  validateFieldValueByType(body.value, body.type)

  const document = await db.model('Document').findOne({ where: { id: documentId, orgId } })

  if (!document) {
    throw ono({ code: 404 }, `Cannot create field, document not found with id: ${documentId}`)
  }

  let createFieldBody

  // For non-versioned fields, set order
  if (!body.versionId) {
    // make sure document fields are ordered correctly and get next order number for new field
    const docFieldCount = await normalizeFieldOrderAndGetCount(documentId, orgId)
    createFieldBody = { ...body, order: docFieldCount }
  } else {
    createFieldBody = body
  }

  const createdField = await document.createField(createFieldBody)

  // Debugging log for mismatched text value to structuredValue
  // Added 2/24/2021 -DH
  if (body.type === FIELD_TYPES.TEXT && body.value && !Boolean(body.structuredValue)) {
    logger(`DEBUG: found TEXT field with length ${body.value.length} with empty structuredValue in BusinessField.createForDocument`)
  }

  const fieldValue = await createdField.addFieldValue({
    value: getDefaultFieldValueByType(body.value, body.type),
    structuredValue: body.structuredValue,
    orgId
  })

  await createdField.setFieldValue(fieldValue.id)

  // set the rendered value on the field
  if (fieldValue.value != null) {
    const renderedValue = await getRenderedValueByType(createdField, fieldValue.value)
    await createdField.update({ renderedValue })
  }

  // this is async, but don't wait for it, fire and move on
  document.markUpdated()

  // another async chain we don't need to wait for, updatedAt gets set all the way up
  db.model('Project').findOne({ where: { id: document.projectId, orgId } }).then((project) => { project.markUpdated() })

  return await findByIdForDocument(createdField.id, documentId, orgId)
}

async function findAllPublishedForDocument(documentId, orgId) {
  const db = getDb()
  const include = getFieldValueInclude(db)

  // Putting document include first, not sure it matters
  include.unshift({
    model: db.model('Document'),
    where: {
      publishedVersionId: { [Op.col]: `${MODEL_NAME}.versionId` }
    },
    attributes: []
  })

  const fields = await db.model(MODEL_NAME).findAll({
    where: { documentId, orgId },
    order: db.col('order'),
    include
  })

  return fields.map(publicFields)
}

// Returns draft and published fields
async function findAllForDocument(documentId, orgId) {
  const db = getDb()
  const include = getFieldValueInclude(db)
  const fields = await db.model(MODEL_NAME).findAll({
    where: {
      documentId,
      orgId
    },
    include
  })

  return fields.map(publicFields)
}

// Returns only draft fields
async function findAllDraftForDocument(documentId, orgId) {
  const db = getDb()
  const include = getFieldValueInclude(db)

  const fields = await db.model(MODEL_NAME).findAll({
    where: {
      documentId,
      orgId,
      versionId: null
    },
    order: db.col('order'),
    include
  })

  return fields.map(publicFields)
}

async function findByIdForDocument(id, documentId, orgId) {
  const db = getDb()
  const include = getFieldValueInclude(db)

  const field = await db.model(MODEL_NAME).findOne({ where: { id, documentId, orgId }, include })

  if (!field) throw ono({ code: 404 }, `No field with id ${id}`)

  return publicFields(field)
}

async function updateByIdForDocument(id, documentId, orgId, body) {
  const db = getDb()

  const document = await db.model('Document').findOne({ where: { id: documentId, orgId } })

  if (!document) {
    throw ono({ code: 404 }, `Cannot update field, document not found with id: ${documentId}`)
  }

  const field = await db.model(MODEL_NAME).findOne({ where: { id, documentId, orgId } })
  if (!field) throw ono({ code: 404 }, `Cannot update, field not found with id: ${id}`)

  if (field.versionId) throw ono({ code: 403 }, `Field ${id} is published, cannot edit`)

  validateFieldValueByType(body.value, field.type)

  const updatedField = await field.update(body)
  const fieldValue = await updatedField.getFieldValue()

  // Debugging log for mismatched text value to structuredValue
  // Added 2/23/2021 -DH
  if (field.type === FIELD_TYPES.TEXT && body.value && !Boolean(body.structuredValue)) {
    logger(`DEBUG: found TEXT field with length ${body.value.length} with empty structuredValue in BusinessField.updateByIdForDocument`)
  }

  await fieldValue.update({ value: body.value, structuredValue: body.structuredValue })

  // set the rendered value on the field
  if (fieldValue.value != null ) {
    const renderedValue = await getRenderedValueByType(updatedField, fieldValue.value)
    await updatedField.update({ renderedValue })
  }

  await updatedField.markUpdated()
  // this is async, but don't wait for it, fire and move on
  document.markUpdated()

  // another async chain we don't need to wait for, updatedAt gets set all the way up
  db.model('Project').findOne({ where: { id: document.projectId, orgId } }).then((project) => { project.markUpdated() })

  return await findByIdForDocument(field.id, documentId, orgId)
}

/**
 * 
 * @param {Number} id 
 * @param {Number} documentId
 * @param {Number} orgId
 * @param {Object} options (optional)
 * 
 * options = {
 *   deletePublished: true/false // ignores published status of field
 *   markUpdated: true/false // whether to update parent document and project
 * }
 */
async function deleteByIdForDocument(id, documentId, orgId, options = {
  deletePublished: false,
  markUpdated: true
}) {
  const db = getDb()

  const document = await db.model('Document').findOne({ where: { id: documentId, orgId } })

  if (!document) {
    throw ono({ code: 404 }, `Cannot delete field, document not found with id: ${documentId}`)
  }

  const field = await db.model(MODEL_NAME).findOne({ where: { id, documentId, orgId } })

  if (!field) throw ono({ code: 404 }, `Cannot delete, field not found with id: ${id}`)

  if (field.versionId && options.deletePublished !== true) {
    throw ono({ code: 403 }, `Field ${id} is published, cannot delete`)
  }

  await field.destroy()

  // this is async, but don't wait for it, fire and move on
  if (options.markUpdated) {
    document.markUpdated()

    // another async chain we don't need to wait for, updatedAt gets set all the way up
    db.model('Project').findOne({ where: { id: document.projectId, orgId } }).then((project) => { project.markUpdated() })
  }

  await normalizeFieldOrderAndGetCount(documentId, orgId)
}

// Note: this will _not_ clean up assets and other field artifacts, it only removes
// the database fields. Use accordingly.
async function deleteAllForDocument(documentId, orgId) {
  const db = getDb()
  const document = await db.model('Document').findOne({ where: { id: documentId, orgId } })

  if (!document) {
    throw ono({ code: 404 }, `Cannot delete fields, document not found with id: ${documentId}`)
  }

  return db.model(MODEL_NAME).destroy({
    where: { orgId, documentId }
  })
}

async function updateOrderById(id, documentId, orgId, newPosition) {
  const db = getDb()

  const document = await db.model('Document').findOne({ where: { id: documentId, orgId } })

  if (!document) {
    throw ono({ code: 404 }, `Cannot update order, document not found with id: ${documentId}`)
  }

  if (newPosition < 0) {
    const message = `Cannot update order, minimum order position is 0`
    throw ono({ code: 400, publicMessage: message }, message)
  }

  // Normalize order before trying to get the current order in case the current order changes
  const currentMax = (await normalizeFieldOrderAndGetCount(documentId, orgId)) - 1

  const field = await db.model(MODEL_NAME).findOne({ where: { id, documentId, orgId } })
  if (!field) throw ono({ code: 404 }, `Cannot update order, field not found with id: ${id}`)

  const currentPosition = field.order

  // no order position change, do nothing
  if (newPosition === currentPosition) return

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
        AND "versionId" IS NULL
        AND "deletedAt" IS NULL
        AND "documentId" = ${documentId}
        AND "order" <= ${newPosition};`,
        { transaction }
      )
    } else if (newPosition < currentPosition) {
      // moving to a lower order position
      await db.query(
        `UPDATE "Fields"
        SET "order" = "order" + 1
        WHERE "order" >= ${newPosition}
        AND "versionId" IS NULL
        AND "deletedAt" IS NULL
        AND "documentId" = ${documentId}
        AND "order" < ${currentPosition};`,
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

  // this is async, but don't wait for it, fire and move on
  document.markUpdated()

  // another async chain we don't need to wait for, updatedAt gets set all the way up
  db.model('Project').findOne({ where: { id: document.projectId, orgId } }).then((project) => { project.markUpdated() })
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
    case FIELD_TYPES.IMAGE:
    case FIELD_TYPES.FILE:
    case FIELD_TYPES.DATE:
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

function getDefaultFieldValueByType(value, type) {
  switch (type) {
    case FIELD_TYPES.DATE:
      if (!value) {
        return (new Date()).toISOString() 
      }
  }

  return value
}

async function normalizeFieldOrderAndGetCount(documentId, orgId) {
  const db = getDb()

  const docFields = await db.model(MODEL_NAME).findAll({
    where: { documentId, orgId, versionId: null },
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

async function deleteAllForOrg(orgId, force = false) {
  const db = getDb()

  return db.model(MODEL_NAME).destroy({
    where: { orgId },
    force
  })
}

// The field coordinator deletes any assets when the field is deleted
async function deleteAllSoftDeletedBefore(timestamp) {
  const db = getDb()

  return db.model(MODEL_NAME).destroy({
    where: {
      deletedAt: {
        [Op.lte]: timestamp
      }
    },
    force: true
  })
}

export default {
  createForDocument,
  updateByIdForDocument,
  findByIdForDocument,
  findAllForDocument,
  findAllDraftForDocument,
  findAllPublishedForDocument,
  deleteByIdForDocument,
  deleteAllForDocument,
  updateOrderById,
  deleteAllForOrg,
  deleteAllSoftDeletedBefore
}
