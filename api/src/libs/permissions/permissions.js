import { PROJECT_RESOURCE_TYPES } from '../../constants/resourceTypes'
import { ORGANIZATION_ROLES, PROJECT_ROLES } from '../../constants/roles'
import checkRolePermissions from './checkRolePermissions'
import projectPermissionGenerator from './projectPermissionGenerator'
import resourceToProject from '../resourceToProject'
import BusinessProjectUser from '../../businesstime/projectuser'
import { permissions as permissionsDebug } from '../debugLoggers'

/*
  requestorInfo = {
    orgId: '123',
    requestorType: 'user',
    requestorId: '234',
    [orgRoleId: 123]
  }

  requestedAction = {
    resourceType: 'project',
    action: 'read',
    data: {
      id: '123'
    }
  }
*/

export function getOrganizationRole(requestorInfo) {
  const roles = []
  if (requestorInfo.orgRoleId) {
    roles.push(ORGANIZATION_ROLES[requestorInfo.orgRoleId])
  }
  return roles
}

export async function getProjectRoles(requestorInfo, requestedAction) {
  const projectRoles = []
  const project = await resourceToProject(requestedAction, requestorInfo.orgId)
  if (!project) {
    permissionsDebug(`project not found`)
    return projectRoles
  }
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
  permissionsDebug(`project roles: ${JSON.stringify(projectRoles)}`)
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
  permissionsDebug(`requestorInfo: ${JSON.stringify(requestorInfo)}`)
  permissionsDebug(`requestedAction: ${JSON.stringify(requestedAction)}`)
  const orgRoles = getOrganizationRole(requestorInfo)
  permissionsDebug(`organization roles: ${JSON.stringify(orgRoles)}`)
  const hasOrgPermission = checkRolePermissions(
    orgRoles,
    requestedAction.resourceType,
    requestedAction.action
  )
  permissionsDebug(`organization access: ${hasOrgPermission}`)
  // If requestor has org permission for the action
  // let them proceed
  if (hasOrgPermission) {
    return true
  }

  const projectResourceAccessHandler = projectResourceHandlers[requestedAction.resourceType]

  if (projectResourceAccessHandler) {
    const projectAccess = await projectResourceAccessHandler(requestorInfo, requestedAction)
    permissionsDebug(`project access: ${projectAccess}`)
    return projectAccess
  }

  permissionsDebug(`access denied`)
  return false
}
