import RESOURCE_TYPES, { PROJECT_RESOURCE_TYPES } from '../../constants/resourceTypes'
import { ORGANIZATION_ROLES, PROJECT_ROLES } from '../../constants/roles'
import checkRolePermissions from './checkRolePermissions'
import projectPermissionGenerator from './projectPermissionGenerator'
import resourceToProjectId from '../resourceToProjectId'
import BusinessProjectUser from '../../businesstime/projectuser'

import userAccess from './users'

/*
  requestorInfo = {
    orgId: '123',
    requestorType: 'user',
    requestorId: '234'
  }

  requestedAction = {
    resourceType: 'project',
    action: 'read',
    data: {
      id: '123'
    }
  }
*/

function getOrganizationRole(requestorInfo) {
  const roles = []
  if (requestorInfo.orgRoleId) {
    roles.push(ORGANIZATION_ROLES[requestorInfo.orgRoleId])
  }
  return roles
}

async function getProjectRoles(requestorInfo, requestedAction) {
  const projectRoles = []
  const projectId = await resourceToProjectId(requestedAction, requestorInfo.orgId)
  const defaultProjectAccess = projectPermissionGenerator(projectId, requestorInfo.orgId)
  projectRoles.push(defaultProjectAccess)
  const projectUser = await BusinessProjectUser.getProjectUserAssignment(
    requestorInfo.requestorId,
    projectId,
    requestorInfo.orgId
  )
  if (projectUser) {
    projectRoles.push(PROJECT_ROLES[projectUser.roleId])
  }

  return projectRoles
}

async function projectResourceHandler(requestorInfo, requestedAction) {
  const projectRoles = await getProjectRoles(requestorInfo, requestedAction)
  const hasProjectPermission = checkRolePermissions(
    projectRoles,
    requestedAction.resourceType,
    requestedAction.action
  )

  return hasProjectPermission
}

const resourceToHandler = {
  [RESOURCE_TYPES.USER]: userAccess
}

PROJECT_RESOURCE_TYPES.forEach((type) => {
  resourceToHandler[type] = projectResourceHandler
})

/**
 * Identifies if the given requestor can perform the requested action
 *
 * @param requestorInfo
 * @param requestedAction
 * @return Boolean
 */
export default async (requestorInfo, requestedAction) => {
  const orgRoles = getOrganizationRole(requestorInfo)
  const hasOrgPermission = checkRolePermissions(
    orgRoles,
    requestedAction.resourceType,
    requestedAction.action
  )
  // If requestor has org permission for the action
  // let them proceed
  if (hasOrgPermission) {
    return true
  }

  const resourceAccessHandler = resourceToHandler[requestedAction.resourceType]

  if (resourceAccessHandler) {
    return await resourceAccessHandler(requestorInfo, requestedAction, orgRoles)
  }

  return false
}
