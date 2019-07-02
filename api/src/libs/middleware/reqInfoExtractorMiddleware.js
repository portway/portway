import RESOURCE_TYPES from '../../constants/resourceTypes'
import ono from 'ono';

// Builds the requestorInfo object on request
export default async (req, res, next) => {
  if (!req.user) {
    return next(ono({ code: 404 }, 'The auth token did not contain valid data'))
  }

  req.requestorInfo = {
    orgId: req.user.orgId,
    requestorType: req.user.type,
    requestorId: req.user.id,
  }

  switch (req.user.type) {
    case RESOURCE_TYPES.USER: {
      req.requestorInfo.orgRoleId = req.user.orgRoleId
      break
    }
    case RESOURCE_TYPES.PROJECT_TOKEN: {
      req.requestorInfo.projectId = req.user.projectId
      req.requestorInfo.roleId = req.user.roleId
    }
  }

  next()
}
