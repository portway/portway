import ono from 'ono'
import Joi from 'joi'

import { validateBody, validateParams } from '../libs/middleware/payloadValidation'
import projectCoordinator from '../coordinators/projectCrud'
import BusinessProject from '../businesstime/project'
import BusinessOrganization from '../businesstime/organization'
import crudPerms from '../libs/middleware/reqCrudPerms'
import RESOURCE_TYPES from '../constants/resourceTypes'
import { requiredFields } from './payloadSchemas/helpers'
import projectSchema from './payloadSchemas/project'
import auditLog, { auditActions } from '../integrators/audit'

const { listPerm, readPerm, createPerm, deletePerm, updatePerm } = crudPerms(
  RESOURCE_TYPES.PROJECT,
  (req) => {
    return { id: req.params.id }
  }
)

const conditionalCreatePerm = async function(req, res, next) {
  const org = await BusinessOrganization.findSanitizedById(req.requestorInfo.orgId)
  // This is currently allowing ANY organization user to create a project, if we want only certain users to be affected by the
  // allowUserProjectCreation flag, we should add an additional role perm to check here
  if (org.allowUserProjectCreation) {
    return next()
  }
  return createPerm(req, res, next)
}

const paramSchema = Joi.compile({
  id: Joi.number()
})

const projectsController = function(router) {
  router.post(
    '/',
    validateBody(requiredFields(RESOURCE_TYPES.PROJECT, 'name'), { includeDetails: true }),
    conditionalCreatePerm,
    addProject
  )
  router.get('/', listPerm, getProjects)
  router.get('/:id', validateParams(paramSchema), readPerm, getProject)
  router.put(
    '/:id',
    validateParams(paramSchema),
    validateBody(projectSchema, { includeDetails: true }),
    updatePerm,
    updateProject
  )
  router.delete('/:id', validateParams(paramSchema), deletePerm, deleteProject)
}

const getProjects = async function(req, res, next) {
  try {
    const projects = await BusinessProject.findAll(req.requestorInfo.orgId)
    res.json({ data: projects })
  } catch (e) {
    next(e)
  }
}

const getProject = async function(req, res, next) {
  const { id } = req.params

  try {
    const project = await BusinessProject.findById(id, req.requestorInfo.orgId)
    if (!project) throw ono({ code: 404 }, `No project with id ${id}`)
    res.json({ data: project })
  } catch (e) {
    next(e)
  }
}

const addProject = async function(req, res, next) {
  const { body } = req
  body.orgId = req.requestorInfo.orgId
  body.createdBy = req.requestorInfo.requestorId

  try {
    const project = await projectCoordinator.createProject(
      body,
      req.requestorInfo.requestorId,
      body.orgId
    )
    res.status(201).json({ data: project })
    auditLog({ userId: req.requestorInfo.requestorId, primaryModel: RESOURCE_TYPES.PROJECT, primaryId: project.id, action: auditActions.ADDED_PRIMARY })
  } catch (e) {
    next(e)
  }
}

const updateProject = async function(req, res, next) {
  const { id } = req.params
  const { body } = req

  body.orgId = req.requestorInfo.orgId

  try {
    const project = await BusinessProject.updateById(id, body, req.requestorInfo.orgId)
    res.status(200).json({ data: project })
    auditLog({ userId: req.requestorInfo.requestorId, primaryModel: RESOURCE_TYPES.PROJECT, primaryId: project.id, action: auditActions.UPDATED_PRIMARY })
  } catch (e) {
    next(e)
  }
}

const deleteProject = async function(req, res, next) {
  const { id } = req.params

  try {
    await projectCoordinator.deleteById(id, req.requestorInfo.orgId)
    res.status(204).send()
    auditLog({ userId: req.requestorInfo.requestorId, primaryModel: RESOURCE_TYPES.PROJECT, primaryId: id, action: auditActions.REMOVED_PRIMARY })
  } catch (e) {
    next(e)
  }
}

export default projectsController
