import resourceTypes, { PROJECT_RESOURCE_TYPES } from '../constants/resourceTypes'
import BusinessDocument from '../businesstime/document'
import BusinessProject from '../businesstime/project'
import ono from 'ono'

/**
 * Finds the project for a requestedAction
 * @param {Object} requestedAction
 * @param {String} orgId
 * @return {Object} project
 */
export default async function(requestedAction, orgId) {
  if (!PROJECT_RESOURCE_TYPES.includes(requestedAction.resourceType)) {
    throw new Error(
      `ResourceType ${requestedAction.resourceType} is not defined in PROJECT_RESOURCE_TYPES`
    )
  }

  let projectId
  let project

  switch (requestedAction.resourceType) {
    case resourceTypes.PROJECT:
      projectId = requestedAction.data.id
    case resourceTypes.DOCUMENT: {
      if (requestedAction.data.projectId) {
        projectId = requestedAction.data.projectId
      }
    }
  }

  if (projectId) {
    project = await BusinessProject.findById(
      requestedAction.data.projectId,
      orgId
    )
  } else if (requestedAction.data.documentId) {
    project = await BusinessDocument.findParentProjectByDocumentId(
      requestedAction.data.documentId,
      orgId
    )
  }

  if (!project) {
    throw ono({ code: 404 }, `Project ${projectId} not found`)
  }
  return project
}