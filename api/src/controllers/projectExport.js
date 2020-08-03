import Joi from '@hapi/joi'
import { validateParams } from '../libs/middleware/payloadValidation'
import { ExtractJwt } from 'passport-jwt'
import jobQueue from '../integrators/jobQueue'
import perms from '../libs/middleware/reqPermissionsMiddleware'
import RESOURCE_TYPES from '../constants/resourceTypes'
import ACTIONS from '../constants/actions'

const getTokenFromReq = ExtractJwt.fromAuthHeaderAsBearerToken()

const exportPerm = (req, res, next) => {
  // TODO: validate we don't need project id in here?
  return perms((req) => {
    return {
      resourceType: RESOURCE_TYPES.PROJECT,
      action: ACTIONS.EXPORT
    }
  })(req, res, next)
}

const paramSchema = Joi.compile({
  projectId: Joi.number().required(),
})

const projectExportController = function(router) {
  // all routes are nested at projects/:projectId/export and receive req.params.projectId
  router.get(
    '/',
    validateParams(paramSchema),
    exportPerm,
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
