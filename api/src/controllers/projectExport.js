import Joi from '@hapi/joi'
import ono from 'ono'
import { validateBody, validateParams } from '../libs/middleware/payloadValidation'
import projectExportCoordinator from '../coordinators/projectExport'
import crudPerms from '../libs/middleware/reqCrudPerms'

const paramSchema = Joi.compile({
  projectId: Joi.number().required(),
})

const projectExportController = function(router) {
  // all routes are nested at projects/:projectId/documents and receive req.params.projectId
  router.get(
    '/',
    validateParams(paramSchema),
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
