import BusinessProject from '../../businesstime/project'
import ACTIONS from '../../constants/actions'
import checkRolePermissions from './checkRolePermissions'

// TODO: implement with project roles
const projectUserAccess = async (requestorInfo, requestedAction) => {
  const hasOrgPermission = checkRolePermissions(
    requestorInfo.roles,
    requestedAction.resourceType,
    requestedAction.action
  )

  // Remove when project roles added
  if (!hasOrgPermission) {
    return false
  }

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
