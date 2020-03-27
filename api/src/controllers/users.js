import Joi from '@hapi/joi'
import ono from 'ono'
import multer from 'multer'

import { validateBody, validateParams, validateQuery } from '../libs/middleware/payloadValidation'
import BusinessUser from '../businesstime/user'
import BusinessOrganization from '../businesstime/organization'
import userCoordinator from '../coordinators/user'
import crudPerms from '../libs/middleware/reqCrudPerms'
import RESOURCE_TYPES from '../constants/resourceTypes'
import perms from '../libs/middleware/reqPermissionsMiddleware'
import ACTIONS from '../constants/actions'
import { requiredFields } from './payloadSchemas/helpers'
import userSchema from './payloadSchemas/user'
import { SORT_METHODS } from '../constants/queryOptions'
import avatarCoordinator from '../coordinators/avatar'

const MAX_AVATAR_FILE_SIZE = 1024 * 1000

const paramSchema = Joi.compile({
  id: Joi.number().required()
})

const querySchema = Joi.compile({
  page: Joi.number(),
  perPage: Joi.number(),
  nameSearch: Joi.string(),
  sortBy: Joi.string().valid('name', 'createdAt'),
  sortMethod: Joi.string().valid(SORT_METHODS.ASCENDING, SORT_METHODS.DESCENDING),
  ids: Joi.array().items(Joi.number())
})

const bodySchema = requiredFields(RESOURCE_TYPES.USER, 'email', 'name')

const { readPerm, listPerm, createPerm, updatePerm, deletePerm } = crudPerms(
  RESOURCE_TYPES.USER,
  (req) => {
    return { id: req.params.id }
  }
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

const conditionalDeletePerm = async (req, res, next) => {
  const { id } = req.params
  const { requestorId, orgId } = req.requestorInfo

  // Never allow deletion of the org owner
  const organization = await BusinessOrganization.findSanitizedById(orgId)
  if (id === organization.ownerId) {
    return next(ono({ code: 404 }, 'Cannot Delete An Organization Owner'))
  }
  // Don't allow self deletion, if we want to add this in the future, add a DELETE_MY perm for users
  if (id === requestorId) {
    return next(ono({ code: 404 }, 'Users Cannot Delete Themselves'))
  }

  return deletePerm(req, res, next)
}

const dirkMiddleware = (req, res, next) => {
  console.log('#######################')
  typeof req.query.ids
  console.log(req.query.ids)
  console.log('#######################')
  next()
}

const usersController = function(router) {
  router.get('/', dirkMiddleware, validateQuery(querySchema), listPerm, getUsers)
  router.get('/:id', validateParams(paramSchema), conditionalReadPerm, getUser)
  router.post('/', validateBody(bodySchema, { includeDetails: true }), createPerm, createUser)
  router.put(
    '/:id',
    validateParams(paramSchema),
    validateBody(userSchema, { includeDetails: true }),
    conditionalUpdatePerm,
    updateUser
  )
  router.delete('/:id', validateParams(paramSchema), conditionalDeletePerm, deleteUser)
  router.post('/:id/resendinvite', validateParams(paramSchema), createPerm, resendInvite)
  router.put(
    '/:id/avatar',
    validateParams(paramSchema),
    multer({
      dest: 'uploads/',
      limits: {
        fileSize: MAX_AVATAR_FILE_SIZE
      }
    }).single('file'),
    validateBody({}),
    conditionalUpdatePerm,
    updateUserAvatar
  )
}

const getUsers = async function(req, res, next) {
  const { page = 1, perPage = 20, nameSearch, sortBy, sortMethod, ids } = req.query
  const options = { page, perPage, sortBy, sortMethod, nameSearch, ids }

  try {
    const { users, count } = await BusinessUser.findAllSanitized(req.requestorInfo.orgId, options)
    res.json({ data: users, page, perPage, total: count, totalPages: Math.ceil(count / perPage) })
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

const updateUserAvatar = async function(req, res, next) {
  const { id } = req.params
  const { file } = req
  const { orgId } = req.requestorInfo

  try {
    const avatar = await avatarCoordinator.updateUserAvatar(orgId, id, file)
    res.status(200).json({ data: { avatar } })
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

const resendInvite = async function(req, res, next) {
  const { id } = req.params
  const { orgId } = req.requestorInfo

  try {
    await userCoordinator.resendInvite(id, orgId)
    res.status(204).send()
  } catch (e) {
    next(e)
  }
}

export default usersController
