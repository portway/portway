import BusinessField from '../businesstime/field'
import BusinessFieldValue from '../businesstime/fieldValue'

async function addFieldAndValue(projectId, docId, fieldBody, value) {
  const field = await BusinessField.createForProjectDocument(projectId, docId, fieldBody)
  const fieldValue = await BusinessFieldValue.create(field.type, value, field.orgId)
  const { updatedField } = await BusinessField.updateByIdForProjectDocument(
    field.id,
    projectId,
    docId,
    field.orgId,
    {
      fieldValueId: fieldValue.id
    }
  )
  return updatedField
}

export default {
  addFieldAndValue
}
