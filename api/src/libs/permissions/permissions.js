import { PROJECT_RESOURCE_TYPES } from '../../constants/resourceTypes'
import { ORGANIZATION_ROLES, PROJECT_ROLES } from '../../constants/roles'
import checkRolePermissions from './checkRolePermissions'
import projectPermissionGenerator from './projectPermissionGenerator'
import resourceToProject from '../resourceToProject'
import BusinessProjectUser from '../../businesstime/projectuser'

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
  const project = await resourceToProject(requestedAction, requestorInfo.orgId)
  const defaultProjectAccess = projectPermissionGenerator(project, requestorInfo.orgId)
  projectRoles.push(defaultProjectAccess)
  const projectUser = await BusinessProjectUser.getProjectUserAssignment(
    requestorInfo.requestorId,
    project.id,
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

const projectResourceHandlers = PROJECT_RESOURCE_TYPES.reduce((typeHandlers, type) => {
  typeHandlers[type] = projectResourceHandler
  return typeHandlers
}, {})

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

  const projectResourceAccessHandler = projectResourceHandlers[requestedAction.resourceType]

  if (projectResourceAccessHandler) {
    return await projectResourceAccessHandler(requestorInfo, requestedAction)
  }

  return false
}
