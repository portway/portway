import checkPermission from '../permissions/permissions'
import ERROR_MESSAGES from '../../constants/errorMessages'
/*
requestorInfo = {
  orgId: '123',
  requestorType: 'user',
  requestorId: '234',
  orgRoleId: 1
}

requestedAction = {
  resourceType: 'project',
  action: 'READ',
  data: {
    id: '123'
  }
}

// endpoint will pass the requested action
// Example actionBuilder function:
function(req) {
  return {
    resourceType: 'project',
    action: 'READ',
    data: {
      id: req.params.id
    }
  }
}
*/

/**
 * Pass an actionBuilder function to check permissions
 * for the current requestorInfo (see reqInfoExtractorMiddleware)
 * @param actionBuilder Function Takes a single request arg to build a
 *                               requestedAction object
 */
export default (actionBuilder) => {
  if (typeof actionBuilder !== 'function') {
    throw new Error('actionBuilder arg must be a function')
  }
  return async (req, res, next) => {
    try {
      const hasPermission = await checkPermission(req.requestorInfo, actionBuilder(req))
      if (hasPermission) {
        next()
      } else {
        throw new Error('Invalid Permissions')
      }
    } catch (e) {
      res.status(404).send({ error: ERROR_MESSAGES.NOT_FOUND })
    }
  }
}