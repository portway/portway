import BusinessDocument from '../businesstime/document'
import BusinessField from '../businesstime/field'
import BusinessDocumentVersion from '../businesstime/documentversion'
import ono from 'ono'
import { FIELD_TYPES } from '../constants/fieldTypes'
import { copyContent, convertCDNUrlToS3Key } from '../integrators/s3'
import webhookCoordinator from './webhook'

// EXPORTS

const publishDocumentVersion = async function(documentId, projectId, orgId) {
  const doc = await BusinessDocument.findByIdForProject(documentId, projectId, orgId)
  if (!doc) {
    throw ono({ code: 404 }, `Document ${documentId} not found, cannot publish`)
  }
  const docVersion = await BusinessDocumentVersion.createVersion(doc.id, doc.name, doc.slug, orgId)
  const fields = await BusinessField.findAllDraftForDocument(doc.id, orgId)
  await Promise.all(fields.map(async (field) => {
    const value = await createVersionedFieldValue(field)
    const newField = processNewFieldVersionByType(field,
      {
        name: field.name,
        value,
        type: field.type,
        versionId: docVersion.id,
        orgId,
        order: field.order
      })
    return BusinessField.createForDocument(doc.id, newField)
  }))
  const updatedDoc = await BusinessDocument.updateByIdForProject(doc.id, doc.projectId, orgId, {
    publishedVersionId: docVersion.id,
    lastPublishedAt: new Date()
  })

  // Don't wait for it, does its own error handling
  webhookCoordinator.sendPublishWebhook(updatedDoc.id, orgId)

  return updatedDoc
}

const unpublishDocument = async function(documentId, projectId, orgId) {
  const doc = await BusinessDocument.findByIdForProject(documentId, projectId, orgId)
  if (!doc) {
    throw ono({ code: 404 }, `Document ${documentId} not found, cannot unpublish`)
  }

  const updatedDoc = await BusinessDocument.updateByIdForProject(doc.id, doc.projectId, orgId, {
    publishedVersionId: null,
    lastPublishedAt: null
  })

  // Don't wait for it, does its own error handling
  webhookCoordinator.sendUnpublishWebhook(updatedDoc.id, orgId)

  return updatedDoc
}

// HELPERS

const createVersionedFieldValue = async function(field) {
  switch (field.type) {
    case FIELD_TYPES.IMAGE:
    case FIELD_TYPES.FILE:
    {
      if (field.value) {
        const key = convertCDNUrlToS3Key(field.value)
        const keyParts = key.split('/')
        const lastIndex = keyParts.length - 1
        keyParts[lastIndex] = `${Date.now()}-${keyParts[lastIndex]}`
        const newKey = keyParts.join('/')
        return await copyContent(key, newKey)
      } else {
        return field.value
      }
    }
    case FIELD_TYPES.DATE:
      if (field.value instanceof Date) {
        return field.value.toISOString()
      } else {
        return field.value
      }
    default:
      return field.value
  }
}

const processNewFieldVersionByType = function(field, newField) {
  switch (field.type) {
    case FIELD_TYPES.TEXT: {
      newField.structuredValue = field.structuredValue
    }
  }
  return newField
}

export default {
  publishDocumentVersion,
  unpublishDocument
}