import BusinessField from '../businesstime/field'
import BusinessFieldValue from '../businesstime/fieldValue'

async function addFieldAndValue(projectId, docId, fieldBody, value, structuredValue) {
  const field = await BusinessField.createForProjectDocument(projectId, docId, fieldBody)
  return field

  // field.addFieldValue(value, structuredValue)

  // const fieldValue = await BusinessFieldValue.create(field.type, value, field.orgId)
  // const { updatedField } = await BusinessField.updateByIdForProjectDocument(
  //   field.id,
  //   projectId,
  //   docId,
  //   field.orgId,
  //   {
  //     fieldValueId: fieldValue.id
  //   }
  // )
  // return { ...updatedField, value: fieldValue.value, structuredValue: fieldValue.structuredValue }
}

export default {
  addFieldAndValue
}
