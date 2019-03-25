import BusinessProject from '../../businesstime/project'

const projectAccess = async (requestorInfo, requestedAction) => {
  switch (requestedAction.action) {
    case 'read':
    case 'write':
      // Current logic allows any org user read/write access to any org project
      // TODO: replace db hit with cache layer / app mem cache
      const businessproject = await BusinessProject.findById(
        requestedAction.data.id,
        requestorInfo.orgId
      )
      const hasProjectAccess = businessproject && businessproject.orgId === requestorInfo.orgId
      return Boolean(hasProjectAccess)
    case 'list':
      // Any user in an org can list projects
      if (requestorInfo.requestorType === 'user') {
        return true
      }
      return false
    case 'create':
      return true
    default:
      return false
  }
}

export default projectAccess
