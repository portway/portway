import projectAccess from './projects'
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

/**
 * Identifies if the given requestor can perform the requested action
 *
 * @param requestorInfo
 * @param requestedAction
 * @return Boolean
 */
export default async (requestorInfo, requestedAction) => {
  let resourceAccessHandler
  switch (requestedAction.resourceType) {
    case 'project':
      resourceAccessHandler = projectAccess
    case 'user': {
      resourceAccessHandler = userAccess
    }
  }
  if (resourceAccessHandler) {
    return resourceAccessHandler(requestorInfo, requestedAction)
  }
  return false
}
