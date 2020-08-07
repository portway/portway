import Joi from '@hapi/joi'
import { validateParams } from '../libs/middleware/payloadValidation'
import { ExtractJwt } from 'passport-jwt'
import jobQueue from '../integrators/jobQueue'
import RESOURCE_TYPES from '../constants/resourceTypes'
import crudPerms from '../libs/middleware/reqCrudPerms'

const getTokenFromReq = ExtractJwt.fromAuthHeaderAsBearerToken()

const { readPerm } = crudPerms(
  RESOURCE_TYPES.PROJECT_EXPORT,
  (req) => { return { projectId: req.params.projectId } }
)

const paramSchema = Joi.compile({
  projectId: Joi.number().required(),
})

const projectExportController = function(router) {
  // all routes are nested at projects/:projectId/export and receive req.params.projectId
  router.get(
    '/',
    validateParams(paramSchema),
    readPerm,
    getProjectExport
  )
}

const getProjectExport = async function(req, res, next) {
  const { projectId } = req.params

  try {
    const url = await jobQueue.runProjectExport(projectId, getTokenFromReq(req))
    res.json({ data: { url } })
  } catch (e) {
    next(e)
  }
}

export default projectExportController
