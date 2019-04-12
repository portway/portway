import resourceTypes, { PROJECT_RESOURCE_TYPES } from '../constants/resourceTypes'
import BusinessDocument from '../businesstime/document'
import ono from 'ono'

/**
 * Finds the project id for a given project resource
 * @param {String} resourceType
 * @param {String} resourceId
 */
export default async function(requestedAction, orgId) {
  if (!PROJECT_RESOURCE_TYPES.includes(requestedAction.resourceType)) {
    throw new Error(
      `ResourceType ${requestedAction.resourceType} is not defined in PROJECT_RESOURCE_TYPES`
    )
  }

  switch (requestedAction.resourceType) {
    case resourceTypes.PROJECT:
      return requestedAction.data.id
    case resourceTypes.DOCUMENT: {
      if (requestedAction.data.projectId) {
        return requestedAction.data.projectId
      }
      const doc = await BusinessDocument.findParentProjectByDocumentId(
        requestedAction.data.documentId,
        orgId
      )
      if (!doc) {
        throw ono({ code: 404 }, `Document ${requestedAction.data.documentId} not found`)
      }
      return doc.projectId
    }
  }
}