import BusinessField from '../businesstime/field'
import { FIELD_TYPES } from '../constants/fieldTypes'
import { processMarkdownWithWorker } from './markdown'
import assetCoordinator from './assets'
import ono from 'ono'

const addFieldToDocument = async function(documentId, body, file) {
  const { orgId } = body
  const fieldBody = await getFieldBodyByType(body, documentId, orgId, file)

  return BusinessField.createForDocument(documentId, fieldBody)
}

const updateDocumentField = async function(fieldId, documentId, orgId, body, file) {
  const field = await BusinessField.findByIdForDocument(fieldId, documentId, orgId)

  if (!field) throw ono({ code: 404 }, `Cannot update, field not found with id: ${fieldId}`)

  const fieldBody = await getFieldBodyByType({ ...body, type: field.type }, documentId, orgId, file)
  return BusinessField.updateByIdForDocument(fieldId, documentId, orgId, fieldBody)
}

const getFieldBodyByType = async function(body, documentId, orgId, file) {
  const fieldBody = { ...body }

  switch (body.type) {
    case FIELD_TYPES.IMAGE:
      let url
      if (file) {
        url = await assetCoordinator.addAssetForDocument(documentId, orgId, file)
      }
      fieldBody.value = url
      break
    case FIELD_TYPES.TEXT:
      const inputBody = body.value || ''
      fieldBody.structuredValue = await processMarkdownWithWorker(inputBody)
      break
    case FIELD_TYPES.STRING:
    case FIELD_TYPES.NUMBER:
    // keep body the same
  }

  return fieldBody
}

export default {
  addFieldToDocument,
  updateDocumentField
}