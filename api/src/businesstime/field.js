import ono from 'ono'

import { getDb } from '../db/dbConnector'
import fieldTypes from '../constants/fieldTypes'
import GLOBAL_PUBLIC_FIELDS from '../constants/globalPublicFields'

const MODEL_NAME = 'Field'
const PUBLIC_FIELDS = [
  ...GLOBAL_PUBLIC_FIELDS,
  'value',
  'structuredValue',
  'orgId',
  'name',
  'docId',
  'versionId',
  'type',
  'order'
]

async function createForProjectDocument(projectId, docId, body) {
  const db = getDb()
  const { orgId } = body

  if (projectId !== body.projectId) {
    throw ono(
      { code: 400 },
      `Cannot create field, project id param does not match projectId in body`
    )
  }

  if (docId !== body.docId) {
    throw ono({ code: 400 }, `Cannot create field, document id param does not match docId in body`)
  }

  const document = await db.model('Document').findOne({ where: { id: docId, projectId, orgId } })

  if (!document) {
    throw ono({ code: 404 }, `Cannot create field, document not found with id: ${docId}`)
  }

  const createdField = await document.createField(body)

  if (body.value || body.structuredValue) {
    const fieldValue = await createdField.addFieldValue({
      value: body.value,
      structuredValue: body.structuredValue,
      orgId
    })

    await createdField.setFieldValue(fieldValue.id)
  }

  return await findByIdForDocument(createdField.id, docId, orgId)
}

async function findAllForDocument(docId, orgId) {
  const db = getDb()

  const include = getInclude(db)

  const fields = await db.model(MODEL_NAME).findAll({ where: { docId, orgId }, include })

  return fields.map((field) => {
    const plainField = field.get({ plain: true })
    return Object.assign({}, ...PUBLIC_FIELDS.map(key => ({ [key]: plainField[key] })))
  })
}

async function findByIdForDocument(id, docId, orgId) {
  const db = getDb()
  const include = getInclude(db)

  const field = await db.model(MODEL_NAME).findOne({ where: { id, docId, orgId }, include })
  const plainField = field.get({ plain: true })
  return Object.assign({}, ...PUBLIC_FIELDS.map(key => ({ [key]: plainField[key] })))
}

async function updateByIdForProjectDocument(id, projectId, docId, orgId, body) {
  const db = getDb()

  const document = await db
    .model('Document')
    .findOne({ where: { id: docId, projectId, orgId }, raw: true })

  if (!document) {
    throw ono({ code: 404 }, `Cannot update field, document not found with id: ${docId}`)
  }

  const field = await db.model(MODEL_NAME).findOne({ where: { id, docId, orgId } })

  if (!field) throw ono({ code: 404 }, `Cannot update, field not found with id: ${id}`)
  const updatedField = await field.update(body)
  return updatedField.get({ plain: true })
}

async function deleteByIdForDocument(id, docId, orgId) {
  const db = getDb()
  const field = await db.model(MODEL_NAME).findOne({ where: { id, docId, orgId } })

  if (!field) throw ono({ code: 404 }, `Cannot delete, field not found with id: ${id}`)

  await field.destroy()
}

function getInclude(db) {
  return Object.values(fieldTypes.FIELD_TYPE_MODELS).map((modelName) => {
    return {
      model: db.model(modelName)
    }
  })
}

export default {
  createForProjectDocument,
  updateByIdForProjectDocument,
  findByIdForDocument,
  findAllForDocument,
  deleteByIdForDocument
}
