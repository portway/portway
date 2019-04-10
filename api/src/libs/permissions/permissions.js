import projectAccess from './projects'
import userAccess from './users'
import projectUserAccess from './projectUsers'
import RESOURCE_TYPES from '../../constants/resourceTypes'
import { ORGANIZATION_ROLE_IDS, ORGANIZATION_ROLES } from '../../constants/roles'

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
  // TODO: do this here? Maybe access handlers don't care?
  requestorInfo.roles = getOrganizationRole(requestorInfo)

  if (resourceAccessHandler) {
    return resourceAccessHandler(requestorInfo, requestedAction)
  }
  return false
}
