// Integrates with bee-queue to interact with workers service
import url from 'url'
import Queue from 'bee-queue'

const redisUrl = new url.URL(process.env.REDIS_URL)

// TODO: move to constants for queue name
const exportQueue = new Queue('PROJECT_EXPORT', {
  isWorker: false,
  redis: {
    host: redisUrl.hostname,
    port: redisUrl.port
  }
})

const runProjectExport = async (projectId, token) => {
  return new Promise((resolve, reject) => {
    const job = exportQueue.createJob({
      projectId,
      token
    })

    job.on('succeeded', (result) => {
      console.log('completed job ' + job.id);
      resolve(result)
    })

    job.on('failed', reject)

    job.save((err) => {
      if (err) {
        reject(err)
      }
      console.log('queued job ' + job.id);
    })
  })
}

export default {
  runProjectExport
}