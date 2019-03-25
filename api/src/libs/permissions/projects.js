import BusinessProject from '../../businesstime/project'
import ACTIONS from '../../constants/actions'
import RESOURCE_TYPES from '../../constants/resourceTypes'

const projectAccess = async (requestorInfo, requestedAction) => {
  switch (requestedAction.action) {
    case ACTIONS.READ:
    case ACTIONS.UPDATE:
    case ACTIONS.DELETE:
      // Current logic allows any org user read/write access to any org project
      // TODO: replace db hit with cache layer / app mem cache
      const businessproject = await BusinessProject.findById(
        requestedAction.data.id,
        requestorInfo.orgId
      )
      const hasProjectAccess = businessproject && businessproject.orgId === requestorInfo.orgId
      return Boolean(hasProjectAccess)
    case ACTIONS.LIST:
      // Any user in an org can list projects
      if (requestorInfo.requestorType === RESOURCE_TYPES.USER) {
        return true
      }
      return false
    case ACTIONS.CREATE:
      return true
    default:
      return false
  }
}

export default projectAccess
