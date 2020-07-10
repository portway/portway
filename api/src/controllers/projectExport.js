import Joi from '@hapi/joi'
import { validateParams } from '../libs/middleware/payloadValidation'
import projectExportCoordinator from '../coordinators/projectExport'
import perms from '../libs/middleware/reqPermissionsMiddleware'
import RESOURCE_TYPES from '../constants/resourceTypes'
import ACTIONS from '../constants/actions'

const exportPerm = (req, res, next) => {
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
  // all routes are nested at projects/:projectId/documents and receive req.params.projectId
  router.get(
    '/',
    validateParams(paramSchema),
    exportPerm,
    getProjectExport
  )
}

const getProjectExport = async function(req, res, next) {
  const { projectId } = req.params
  const { orgId } = req.requestorInfo

  try {
    await projectExportCoordinator.getProjectExportData(projectId, orgId)

    res.set('Content-Type', 'application/zip')
  } catch (e) {
    next(e)
  }
}

export default projectExportController
