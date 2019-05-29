import Joi from 'joi'
import ono from 'ono'

import { validateBody, validateParams } from '../libs/middleware/payloadValidation'
import BusinessUser from '../businesstime/user'
import userCoordinator from '../coordinators/user'
import crudPerms from '../libs/middleware/reqCrudPerms'
import RESOURCE_TYPES from '../constants/resourceTypes'
import perms from '../libs/middleware/reqPermissionsMiddleware'
import ACTIONS from '../constants/actions'
import { requiredFields } from './payloadSchemas/helpers'
import userSchema from './payloadSchemas/user'

const paramSchema = Joi.compile({
  id: Joi.number().required()
})

const bodySchema = requiredFields(RESOURCE_TYPES.USER, 'email', 'name')

const { readPerm, listPerm, createPerm, updatePerm, deletePerm } = crudPerms(
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

const conditionalUpdatePerm = (req, res, next) => {
  const { id } = req.params
  // if ids match use the 'UPDATE_MY' user perm
  if (id === req.requestorInfo.requestorId) {
    return perms((req) => {
      return {
        resourceType: RESOURCE_TYPES.USER,
        action: ACTIONS.UPDATE_MY
      }
    })(req, res, next)
  }
  // not requesting self, normal user update perm
  return updatePerm(req, res, next)
}

const usersController = function(router) {
  router.get('/', listPerm, getUsers)
  router.get('/:id',
    validateParams(paramSchema),
    conditionalReadPerm,
    getUser
  )
  router.post('/',
    validateBody(bodySchema, { includeDetails: true }),
    createPerm,
    createUser
  )
  router.put('/:id',
    validateParams(paramSchema),
    validateBody(userSchema, { includeDetails: true }),
    conditionalUpdatePerm,
    updateUser
  )
  router.delete('/:id',
    validateParams(paramSchema),
    deletePerm,
    deleteUser
  )
}

const getUsers = async function(req, res, next) {
  try {
    const users = await BusinessUser.findAllSanitized(req.requestorInfo.orgId)
    res.json({ data: users })
  } catch (e) {
    next(e)
  }
}

const getUser = async function(req, res, next) {
  const { id } = req.params

  try {
    const user = await BusinessUser.findSanitizedById(id, req.requestorInfo.orgId)
    if (!user) throw ono({ code: 404 }, `No user with id ${id}`)
    res.json({ data: user })
  } catch (e) {
    next(e)
  }
}

const createUser = async function(req, res, next) {
  const { body } = req
  const { email, name } = body
  const { orgId } = req.requestorInfo

  try {
    const user = await userCoordinator.createPendingUser(email, name, orgId)
    res.status(201).json({ data: user })
  } catch (e) {
    next(e)
  }
}

const updateUser = async function(req, res, next) {
  const { id } = req.params
  const { body } = req
  const { orgId } = req.requestorInfo

  try {
    const user = await BusinessUser.updateById(id, body, orgId)
    res.status(200).json({ data: user })
  } catch (e) {
    next(e)
  }
}

const deleteUser = async function(req, res, next) {
  const { id } = req.params
  const { orgId } = req.requestorInfo

  try {
    await userCoordinator.deleteById(id, orgId)
    res.status(204).send()
  } catch (e) {
    next(e)
  }
}

export default usersController
