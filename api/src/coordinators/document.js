import BusinessDocument from '../businesstime/document'
import BusinessField from '../businesstime/field'
import BusinessDocumentVersion from '../businesstime/documentversion'
import { slugify } from '../libs/utils'

const addProjectDocument = async (projectId, body) => {
  body.slug = slugify(body.name)
  return await BusinessDocument.createForProject(projectId, body)
}

// Removes a document and all associated resources
const deleteDocument = async (docId, projectId, orgId) => {
  // Delete document fields
  await BusinessField.deleteAllForDocument(docId, orgId)
  // Delete document versions
  await BusinessDocumentVersion.deleteAllForDocument(docId, orgId)
  // Delete document
  await BusinessDocument.deleteByIdForProject(docId, projectId, orgId)
}

const deleteAllForProject = async (projectId, orgId) => {
  const docs = await BusinessDocument.findAllForProject(projectId)
  await Promise.all(docs.map((doc) => {
    return documentCoordinator.deleteDocument(doc.id, projectId, orgId)
  }))
}

const documentCoordinator = {
  addProjectDocument,
  deleteDocument,
  deleteAllForProject
}

export default documentCoordinator