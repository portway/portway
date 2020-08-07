import url from 'url'
import Queue from 'bee-queue'
import { QUEUES } from './constants/queues'
import projectExportCoordinator from './coordinators/projectExport'
import logger from './libs/logger'
import { LOG_LEVELS } from './constants/logging'

const redisUrl = new url.URL(process.env.REDIS_URL)

export default function() {
  const queue = new Queue(QUEUES.PROJECT_EXPORT, {
    redis: {
      host: redisUrl.hostname,
      port: redisUrl.port
    }
  })

  queue.on('failed', (job, err) => {
    logger(LOG_LEVELS.ERROR, `failed job ${job.id}`)
    logger(LOG_LEVELS.ERROR, err)
  })

  queue.on('ready', function () {
    queue.process(async (job) => {
      logger(LOG_LEVELS.INFO, `processing job ${job.id}`)
      const url = await projectExportCoordinator.getProjectExportData(job.data.projectId, job.data.token)
      return url
    })
    logger(LOG_LEVELS.INFO, `processing jobs in queue ${QUEUES.PROJECT_EXPORT}`)
  });
}