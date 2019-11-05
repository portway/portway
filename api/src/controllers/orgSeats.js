import Joi from 'joi'
import ono from 'ono'

import billingCoordinator from '../coordinators/billing'
import BusinessOrganization from '../businesstime/organization'
import { validateBody, validateParams } from '../libs/middleware/payloadValidation'
import perms from '../libs/middleware/reqPermissionsMiddleware'
import RESOURCE_TYPES from '../constants/resourceTypes'
import ACTIONS from '../constants/actions'

const bodySchema = Joi.compile({
  seats: Joi.number().min(5).required()
})

const paramSchema = Joi.compile({
  orgId: Joi.number().required()
})

const conditionalUpdatePerm = async (req, res, next) => {
  const { orgId } = req.params

  // make sure requestor is updating their own organization
  if (orgId !== req.requestorInfo.orgId) {
    return next(
      ono(
        { code: 404 },
        'Cannot update plan seats, requestor does not belong to the target organization '
      )
    )
  }

  // look up the organization and make sure the ruquestor is the current owner
  const org = await BusinessOrganization.findSanitizedById(orgId)

  if (org.ownerId !== req.requestorInfo.requestorId) {
    return next(
      ono({ code: 404 }, 'Cannot update plan seats, requestor is not the current organization owner')
    )
  }

  return perms((req) => {
    return {
      resourceType: RESOURCE_TYPES.ORGANIZATION,
      action: ACTIONS.UPDATE_MY_PLAN
    }
  })(req, res, next)
}

const orgSeatController = function(router) {
  // all routes are nested at organizations/:orgId and receive req.params.orgId
  router.put(
    '/',
    validateParams(paramSchema),
    validateBody(bodySchema),
    conditionalUpdatePerm,
    updateSeats
  )
}

const updateSeats = async function(req, res, next) {
  const { seats } = req.body
  const { orgId } = req.params

  try {
    await billingCoordinator.updatePlanSeats(seats, orgId)
    res.status(204).send()
  } catch (e) {
    next(e)
  }
}

export default orgSeatController
