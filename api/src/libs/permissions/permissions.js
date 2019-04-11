import projectAccess from './projects'
import documentAccess from './documents'
import userAccess from './users'
import RESOURCE_TYPES from '../../constants/resourceTypes'
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

const resourceToHandler = {
  [RESOURCE_TYPES.DOCUMENT]: documentAccess,
  [RESOURCE_TYPES.PROJECT]: projectAccess,
  [RESOURCE_TYPES.USER]: userAccess
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

  if (resourceAccessHandler) {
    return resourceAccessHandler(requestorInfo, requestedAction)
  }
  return false
}
