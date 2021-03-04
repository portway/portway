import url from 'url'
import Queue from 'bee-queue'
import { QUEUES } from './constants/queues'
import projectExportCoordinator from './coordinators/projectExport'
import imageProcessingCoordinator from './coordinators/imageProcessing'
import logger from './libs/logger'
import { LOG_LEVELS } from './constants/logging'

const redisUrl = new url.URL(process.env.REDIS_URL)

export default function() {
  // PROJECT EXPORT
  const projectExportQueue = new Queue(QUEUES.PROJECT_EXPORT, {
    redis: {
      host: redisUrl.hostname,
      port: redisUrl.port
    }
  })

  projectExportQueue.on('failed', (job, err) => {
    logger(LOG_LEVELS.ERROR, `failed job ${job.id} in queue ${QUEUES.PROJECT_EXPORT}`)
    logger(LOG_LEVELS.ERROR, err)
  })

  projectExportQueue.on('ready', function () {
    projectExportQueue.process(async (job) => {
      logger(LOG_LEVELS.INFO, `processing job ${job.id} in queue ${QUEUES.PROJECT_EXPORT}`)
      const url = await projectExportCoordinator.getProjectExportData(job.data.projectId, job.data.token)
      return url
    })
    logger(LOG_LEVELS.INFO, `processing jobs in queue ${QUEUES.PROJECT_EXPORT}`)
  })

  // IMAGE PROCESSING
  const imageProcessingQueue = new Queue(QUEUES.IMAGE_PROCESSING, {
    redis: {
      host: redisUrl.hostname,
      port: redisUrl.port
    }
  })

  imageProcessingQueue.on('failed', (job, err) => {
    logger(LOG_LEVELS.ERROR, `failed job ${job.id} in queue ${ QUEUES.IMAGE_PROCESSING }`)
    logger(LOG_LEVELS.ERROR, err)
  })

  imageProcessingQueue.on('ready', function () {
    imageProcessingQueue.process(async (job) => {
      logger(LOG_LEVELS.INFO, `processing job ${job.id} in queue ${ QUEUES.IMAGE_PROCESSING }`)
      const results = await imageProcessingCoordinator.createImageAlternatives(job.data.url, job.data.documentId, job.data.fieldId, job.data.orgId)
      console.log(results)
      return results
    })
    logger(LOG_LEVELS.INFO, `processing jobs in queue ${QUEUES.IMAGE_PROCESSING}`)
  })


}