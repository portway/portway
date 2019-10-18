import BusinessField from '../businesstime/field'
import { uploadContent } from '../integrators/s3'
import { FIELD_TYPES } from '../constants/fieldTypes'
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
        url = await uploadContent(documentId, orgId, file)
      }
      fieldBody.value = url
    case FIELD_TYPES.STRING:
    case FIELD_TYPES.NUMBER:
    case FIELD_TYPES.TEXT:
    // keep body the same
  }

  return fieldBody
}

export default {
  addFieldToDocument,
  updateDocumentField
}