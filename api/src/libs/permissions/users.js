import ACTIONS from '../../constants/actions'
import RESOURCE_TYPES from '../../constants/resourceTypes'

const projectAccess = async (requestorInfo, requestedAction) => {
  switch (requestedAction.action) {
    case ACTIONS.READ:
      // allow any user to read any other org user
      return true
    case ACTIONS.UPDATE:
      // User can only write itself
      return requestorInfo.requestorType === RESOURCE_TYPES.USER &&
        requestedAction.data.id === requestorInfo.requestorId
    case ACTIONS.LIST:
      // Any user in an org can list other org users
      if (requestorInfo.requestorType === RESOURCE_TYPES.USER) {
        return true
      }
      return false
    case ACTIONS.DELETE:
      // TODO: let org admins delete anyone but the org owner
      return false
    default:
      return false
  }
}

export default projectAccess
