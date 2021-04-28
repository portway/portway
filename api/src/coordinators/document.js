
import FieldCoordinator from './field'
import BusinessDocument from '../businesstime/document'
import BusinessField from '../businesstime/field'
import BusinessDocumentVersion from '../businesstime/documentversion'
import webhookCoordinator from '../coordinators/webhook'
import { slugify } from '../libs/utils'

const addProjectDocument = async (projectId, body) => {
  body.slug = slugify(body.name)
  return await BusinessDocument.createForProject(projectId, body)
}

/**
 * Removes a document and all associated resources
 *
 * @param {Integer} docId
 * @param {Integer} projectId
 * @param {Integer} orgId
 * @param {Object} options optional options
 *
 * options = {
 *   // Whether to set updatedAt on the parent project and document
 *   markUpdated: true/false
 * }
 */
const deleteDocument = async (docId, projectId, orgId, options = {
  markUpdated: true
}) => {
  const fieldOptions = {
    deletePublished: true,
    markUpdated: options.markUpdated
  }

  // Delete document fields
  const fields = await BusinessField.findAllForDocument(docId, orgId)
  for (const field of fields) {
    await FieldCoordinator.removeDocumentField(field.id, docId, orgId, fieldOptions)
  }
  // Delete document versions
  await BusinessDocumentVersion.deleteAllForDocument(docId, orgId)
  // Delete document
  await BusinessDocument.deleteByIdForProject(docId, projectId, orgId, options)

  // Don't wait for it, does its own error handling
  webhookCoordinator.sendDocumentDeleteWebhook(docId, projectId, orgId)
}

const deleteAllForProject = async (projectId, orgId) => {
  // Do not update parent resource (project, document) with updatedAt since we're deleting the project
  const options = { markUpdated: false }

  const docs = await BusinessDocument.findAllForProject(projectId, orgId)
  await Promise.all(docs.map((doc) => {
    return documentCoordinator.deleteDocument(doc.id, projectId, orgId, options)
  }))
}

const duplicateDocument = async (documentId, projectId, orgId) => {
  // fetch the original document
  const document = await BusinessDocument.findByIdForProject(documentId, projectId, orgId)
  // fetch the fields
  const fields = await BusinessField.findAllDraftForDocument(documentId, orgId)
  // create the dupe doc body
  let slug
  if (document.slug != null) {
    // sanitize the new slug
    slug = `${document.slug}-copy`.toLowerCase().replace(/[^a-z0-9\-]/g, '-').slice(0, 140)
  }

  const body = {
    name: `${document.name} copy`,
    slug,
    projectId: document.projectId,
    orgId
  }
  // create the duplicate document
  const dupeDoc = await BusinessDocument.createForProject(projectId, body)
  // loop through fields and create the duplicates
  for (const field of fields) {
    await FieldCoordinator.duplicateField(field.id, document.id, dupeDoc.id, orgId)
  }
  // we could technically assemble this payload from the retuned values above, but
  // just in case, go through the normal pathway for fetching
  return BusinessDocument.findByIdWithFields(dupeDoc.id, orgId)
}

const documentCoordinator = {
  addProjectDocument,
  deleteDocument,
  deleteAllForProject,
  duplicateDocument
}

export default documentCoordinator