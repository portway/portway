import RESOURCE_TYPES from '../../constants/resourceTypes'

// Builds the requestorInfo object on request
export default async (req, res, next) => {
  // TODO: update to handle API tokens
  req.requestorInfo = {
    orgId: req.user.orgId,
    requestorType: RESOURCE_TYPES.USER,
    requestorId: req.user.id
  }
  next()
}
