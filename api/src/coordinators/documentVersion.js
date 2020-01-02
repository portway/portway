import BusinessDocument from '../businesstime/document'
import BusinessField from '../businesstime/field'
import BusinessDocumentVersion from '../businesstime/documentversion'
import ono from 'ono'

const publishDocumentVersion = async function(documentId, projectId, orgId) {
  const doc = await BusinessDocument.findByIdForProject(documentId, projectId, orgId)
  if (!doc) {
    throw ono({ code: 404 }, `Document ${documentId} not found, cannot publish`)
  }
  const docVersion = await BusinessDocumentVersion.createVersion(doc.id, doc.name, orgId)
  const fields = await BusinessField.findAllForDocument(doc.id, orgId)
  await Promise.all(fields.map((field) => {
    return BusinessField.createForDocument(doc.id, {
      name: field.name,
      value: field.value,
      type: field.type,
      versionId: docVersion.id,
      orgId,
      order: field.order
    })
  }))
  return await BusinessDocument.updateByIdForProject(doc.id, doc.projectId, orgId, {
    publishedVersionId: docVersion.id,
    lastPublishedAt: new Date()
  })
}

const unpublishDocument = async function(documentId, projectId, orgId) {
  const doc = await BusinessDocument.findByIdForProject(documentId, projectId, orgId)
  if (!doc) {
    throw ono({ code: 404 }, `Document ${documentId} not found, cannot unpublish`)
  }

  return await BusinessDocument.updateByIdForProject(doc.id, doc.projectId, orgId, {
    publishedVersionId: null,
    lastPublishedAt: null
  })
}

export default {
  publishDocumentVersion,
  unpublishDocument
}