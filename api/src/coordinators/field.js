import BusinessField from '../businesstime/field'
import { uploadImage } from '../integrators/s3'
import { FIELD_TYPES } from '../constants/fieldTypes'

const addFieldToDocument = async function(docId, body, file) {
  const fieldBody = { ...body }

  switch (body.type) {
    case FIELD_TYPES.IMAGE:
      const url = await uploadImage(file)
      fieldBody.value = url
    case FIELD_TYPES.STRING:
    case FIELD_TYPES.NUMBER:
    case FIELD_TYPES.TEXT:
      // keep body the same
  }

  return BusinessField.createForDocument(docId, fieldBody)
}

export default {
  addFieldToDocument
}