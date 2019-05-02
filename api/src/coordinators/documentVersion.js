import BusinessDocument from '../businesstime/document'
import BusinessField from '../businesstime/field'

const publishDocumentVersion = async function(id, projectId, orgId) {
  const doc = await BusinessDocument.findByIdForProject(id, projectId, orgId)
  const fields = await BusinessField.findAllForDocument(doc.id, orgId)

  // get document
  // get document fields
  // copy document fields
  // update document with version id
}

export default {
  publishDocumentVersion
}