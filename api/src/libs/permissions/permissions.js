import projectAccess from './projects'
import documentAccess from './documents'
import userAccess from './users'
import projectUserAccess from './projectUsers'
import RESOURCE_TYPES from '../../constants/resourceTypes'
import { ORGANIZATION_ROLES } from '../../constants/roles'
import checkRolePermissions from './checkRolePermissions'

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

const resourceToHandler = {
  [RESOURCE_TYPES.DOCUMENT]: documentAccess,
  [RESOURCE_TYPES.PROJECT]: projectAccess,
  [RESOURCE_TYPES.USER]: userAccess,
  [RESOURCE_TYPES.PROJECT_USER]: projectUserAccess
}

/**
 * Identifies if the given requestor can perform the requested action
 *
 * @param requestorInfo
 * @param requestedAction
 * @return Boolean
 */
export default async (requestorInfo, requestedAction) => {
  const resourceAccessHandler = resourceToHandler[requestedAction.resourceType]
  const hasOrgPermission = checkRolePermissions(
    getOrganizationRole(requestorInfo),
    requestedAction.resourceType,
    requestedAction.action
  )
  // If requestor has org permission for the action
  // let them proceed
  if (hasOrgPermission) {
    return true
  }

  // TODO: Now see if they have project access

  if (resourceAccessHandler) {
    return resourceAccessHandler(requestorInfo, requestedAction)
  }
  return false
}
