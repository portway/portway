import BusinessDocument from '../businesstime/document'
import BusinessField from '../businesstime/field'
import BusinessDocumentVersion from '../businesstime/documentversion'

const publishDocumentVersion = async function(id, projectId, orgId) {
  const doc = await BusinessDocument.findByIdForProject(id, projectId, orgId)
  const docVersion = await BusinessDocumentVersion.createVersion(doc.id, orgId)
  const fields = await BusinessField.findAllForDocument(doc.id, orgId)
  await Promise.all(fields.map(async (field) => {
    return await BusinessField.createForDocument(doc.id, {
      name: field.name,
      value: field.value,
      type: field.type,
      versionId: docVersion.id
    })
  }))
  return await BusinessDocument.updateByIdForProject(doc.id, doc.projectId, orgId, {
    publishedVersionId: docVersion.id
  })
}

export default {
  publishDocumentVersion
}