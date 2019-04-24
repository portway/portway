import RESOURCE_TYPES from '../../constants/resourceTypes'

// Builds the requestorInfo object on request
export default async (req, res, next) => {
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
    }
  }

  next()
}
