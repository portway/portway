import BusinessField from '../businesstime/field'
import { uploadImage } from '../integrators/s3'
import { FIELD_TYPES } from '../constants/fieldTypes'

const addFieldToDocument = async function(docId, body, file) {
  const fieldBody = await getFieldBodyByType(body, file)

  return BusinessField.createForDocument(docId, fieldBody)
}

const updateDocumentField = async function(fieldId, docId, orgId, body, file) {
  const field = await BusinessField.findByIdForDocument(fieldId, docId, orgId)

  const fieldBody = await getFieldBodyByType({ ...body, type: field.type }, file)

  return BusinessField.updateByIdForDocument(fieldId, docId, orgId, fieldBody)
}

const getFieldBodyByType = async function(body, file) {
  const fieldBody = { ...body }

  switch (body.type) {
    case FIELD_TYPES.IMAGE:
      let url
      if (file) {
        url = await uploadImage(file)
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