import BusinessDocument from '../businesstime/document'
import BusinessField from '../businesstime/field'
import BusinessDocumentVersion from '../businesstime/documentversion'

const publishDocumentVersion = async function(docId, projectId, orgId) {
  const doc = await BusinessDocument.findByIdForProject(docId, projectId, orgId)
  const docVersion = await BusinessDocumentVersion.createVersion(doc.id, orgId)
  const fields = await BusinessField.findAllForDocument(doc.id, orgId)
  await Promise.all(fields.map((field) => {
    return BusinessField.createForDocument(doc.id, {
      name: field.name,
      value: field.value,
      type: field.type,
      versionId: docVersion.id,
      orgId
    })
  }))
  return await BusinessDocument.updateByIdForProject(doc.id, doc.projectId, orgId, {
    publishedVersionId: docVersion.id
  })
}

export default {
  publishDocumentVersion
}