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
    const exportData = await projectExportCoordinator.getProjectExportData(projectId, orgId)

    res.set('Content-Type', 'application/zip')

  } catch (e) {
    next(e)
  }
}

export default projectExportController


// const getBlobFile = async function (req, res) {
//   try {
//     res.set('Content-Type', 'application/zip')
//     await blob.getBlob(req.params.id, res)
//   } catch (err) {
//     console.error(err)
//     res.status(err.statusCode || 500).send({ error: 'Unable to get export file' })
//   }
//   blob.deleteBlob(req.params.id)
// }

// const pollExportJob = async function (req, res) {
//   try {
//     const status = await exportIntegrator.pollJobCompletion(req.params.exportJobId)
//     status.url = `/api/files/${status.blobName}`
//     res.status(200).send(status)
//   } catch (err) {
//     console.error(err)
//     res.status(err.statusCode || 500).send({ error: 'Error polling job id' })
//   }
// }
