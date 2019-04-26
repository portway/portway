import Joi from 'joi'
import { validateParams } from '../libs/middleware/payloadValidation'

import BusinessUser from '../businesstime/user'
import ono from 'ono'
import crudPerms from '../libs/middleware/reqCrudPerms'
import RESOURCE_TYPES from '../constants/resourceTypes'
import perms from '../libs/middleware/reqPermissionsMiddleware'
import ACTIONS from '../constants/actions'

const paramSchema = Joi.compile({
  id: Joi.number().required()
})

const { readPerm, listPerm } = crudPerms(
  RESOURCE_TYPES.USER,
  (req) => { return { id: req.params.id } }
)

const conditionalReadPerm = (req, res, next) => {
  const { id } = req.params
  // if ids match use the 'READ_MY' user perm
  if (id === req.requestorInfo.requestorId) {
    return perms((req) => {
      return {
        resourceType: RESOURCE_TYPES.USER,
        action: ACTIONS.READ_MY
      }
    })(req, res, next)
  }
  // not requesting self, normal user read perm
  return readPerm(req, res, next)
}

const usersController = function(router) {
  router.get('/', listPerm, getUsers)
  router.get(
    '/:id',
    validateParams(paramSchema),
    conditionalReadPerm,
    getUser
  )
}

const getUsers = async function(req, res) {
  try {
    const users = await BusinessUser.findAllSanitized(req.requestorInfo.orgId)
    res.json({ data: users })
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot fetch users' })
  }
}

const getUser = async function(req, res) {
  const id = req.params.id

  try {
    const user = await BusinessUser.findSanitizedById(id, req.requestorInfo.orgId)
    if (!user) throw ono({ code: 404 }, `No user with id ${id}`)
    res.json({ data: user })
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: `error fetching user with id ${id}` })
  }
}

export default usersController
