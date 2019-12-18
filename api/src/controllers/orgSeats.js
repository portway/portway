import Joi from 'joi'
import ono from 'ono'

import billingCoordinator from '../coordinators/billing'
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

const readPerm = (req, res, next) => {
  const { orgId } = req.params

  // make sure requestor is getting info on own org seats
  if (orgId !== req.requestorInfo.orgId) {
    return next(
      ono(
        { code: 404 },
        'Cannot fetch plan seats, requestor does not belong to the target organization '
      )
    )
  }

  return perms((req) => {
    return {
      resourceType: RESOURCE_TYPES.SEAT,
      action: ACTIONS.READ
    }
  })(req, res, next)
}

const conditionalUpdatePerm = (req, res, next) => {
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

  return perms((req) => {
    return {
      resourceType: RESOURCE_TYPES.ORGANIZATION,
      action: ACTIONS.UPDATE_MY_PLAN
    }
  })(req, res, next)
}

const orgSeatController = function(router) {
  // all routes are nested at organizations/:orgId and receive req.params.orgId
  router.get('/',
    validateParams(paramSchema),
    readPerm,
    getSeats
  )

  router.put(
    '/',
    validateParams(paramSchema),
    validateBody(bodySchema, { includeDetails: true }),
    conditionalUpdatePerm,
    updateSeats
  )
}

const getSeats = async function(req, res, next) {
  const { orgId } = req.params

  try {
    const billing = await billingCoordinator.getOrgBilling(orgId)
    const { totalSeats, usedSeats, includedSeats } = billing.subscription
    res.status(200).send({
      data: {
        usedSeats,
        totalSeats,
        includedSeats
      }
    })
  } catch (e) {
    next(e)
  }
}

const updateSeats = async function(req, res, next) {
  const { seats } = req.body
  const { orgId } = req.params

  try {
    const totalSeats = await billingCoordinator.updatePlanSeats(seats, orgId)
    res.status(200).send({ totalSeats })
  } catch (e) {
    next(e)
  }
}

export default orgSeatController
