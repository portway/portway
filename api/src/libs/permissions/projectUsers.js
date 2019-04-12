import BusinessProject from '../../businesstime/project'
import ACTIONS from '../../constants/actions'

// TODO: implement with project roles
const projectUserAccess = async (requestorInfo, requestedAction) => {
  switch (requestedAction.action) {
    case ACTIONS.LIST:
    case ACTIONS.READ:
    case ACTIONS.UPDATE:
    case ACTIONS.DELETE:
      const businessproject = await BusinessProject.findById(
        requestedAction.data.id,
        requestorInfo.orgId
      )
      const hasProjectAccess = businessproject && businessproject.orgId === requestorInfo.orgId
      return Boolean(hasProjectAccess)
    default:
      return false
  }
}

export default projectUserAccess
