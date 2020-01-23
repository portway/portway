import BusinessDocument from '../businesstime/document'
import BusinessField from '../businesstime/field'
import BusinessDocumentVersion from '../businesstime/documentversion'
import ono from 'ono'
import { FIELD_TYPES } from '../constants/fieldTypes'
import { copyContent, convertCDNUrlToS3Key } from '../integrators/s3'

const publishDocumentVersion = async function(documentId, projectId, orgId) {
  const doc = await BusinessDocument.findByIdForProject(documentId, projectId, orgId)
  if (!doc) {
    throw ono({ code: 404 }, `Document ${documentId} not found, cannot publish`)
  }
  const docVersion = await BusinessDocumentVersion.createVersion(doc.id, doc.name, orgId)
  const fields = await BusinessField.findAllForDocument(doc.id, orgId)
  await Promise.all(fields.map(async (field) => {
    const value = await createVersionedFieldValue(field)
    return BusinessField.createForDocument(doc.id, {
      name: field.name,
      value,
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

const createVersionedFieldValue = async function(field) {
  switch (field.type) {
    case FIELD_TYPES.IMAGE: {
      return await copyContent(convertCDNUrlToS3Key(field.value))
    }
    default:
      return field.value
  }
}

export default {
  publishDocumentVersion,
  unpublishDocument
}