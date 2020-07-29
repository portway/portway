import url from 'url'

import Queue from 'bee-queue'
import { QUEUES } from './constants/queues'
import projectExportCoordinator from './coordinators/projectExport'

const redisUrl = new url.URL(process.env.REDIS_URL)

export default function() {
  const queue = new Queue(QUEUES.PROJECT_EXPORT, {
    redis: {
      host: redisUrl.hostname,
      port: redisUrl.port
    }
  })

  queue.on('ready', function () {
    queue.process(async (job) => {
      console.log('processing job ' + job.id);
      const url = await projectExportCoordinator.getProjectExportData(job.data.projectId, job.data.token)
      return url
    })

    console.info(`processing jobs in queue ${QUEUES.PROJECT_EXPORT}`);
  });
}