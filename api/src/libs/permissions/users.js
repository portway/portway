const projectAccess = async (requestorInfo, requestedAction) => {
  switch (requestedAction.action) {
    case 'read':
      // allow any user to read any other org user
      return true
    case 'write':
      // User can only write itself
      return requestorInfo.requestorType === 'user' && requestedAction.id === requestorInfo.id
    case 'list':
      // Any user in an org can list other org users
      if (requestorInfo.requestorType === 'user') {
        return true
      }
      return false
    default:
      return false
  }
}

export default projectAccess
