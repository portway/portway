// Integrates with bee-queue to interact with workers service
import url from 'url'
import Queue from 'bee-queue'
import { QUEUE_NAMES } from '../constants/queue'

const redisUrl = new url.URL(process.env.REDIS_URL)

const exportQueue = new Queue(QUEUE_NAMES.PROJECT_EXPORT, {
  isWorker: false,
  redis: {
    host: redisUrl.hostname,
    port: redisUrl.port
  }
})

const imageProcessingQueue = new Queue(QUEUE_NAMES.IMAGE_PROCESSING, {
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
      resolve(result)
    })

    job.on('failed', reject)

    job.save((err) => {
      if (err) {
        reject(err)
      }
    })
  })
}

const runImageProcessing = async (url, documentId, fieldId) => {
  return new Promise((resolve, reject) => {
    const job = imageProcessingQueue.createJob({
      url,
      documentId,
      fieldId
    })

    job.on('succeeded', (result) => {
      resolve(result)
    })

    job.on('failed', reject)

    job.save((err) => {
      if (err) {
        reject(err)
      }
    })
  })
}

export default {
  runProjectExport,
  runImageProcessing
}