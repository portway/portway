import sharp from 'sharp'
import axios from 'axios'
import { uploadBuffer } from '../integrators/s3'
import path from 'path'
import { lookup } from 'mime-types'
import fs from 'fs'
import { promisifyStreamPipe } from '../libs/utils'
import moment from 'moment'
import logger from '../libs/logger'
import { LOG_LEVELS } from '../constants/logging'
import portwayAPI from '../integrators/portwayAPI'

sharp.cache(false)
sharp.concurrency(0)

const IMAGE_TEMP_DIRECTORY = process.env.IMAGE_TEMP_DIRECTORY || 'image_temp/'

const createImageAlternatives = async function(url, documentId, fieldId, orgId) {
  const s3Location = url.split('/').slice(3, -1).join('/')
  const extension = path.extname(url)
  const basename = path.basename(url, extension)
  const basekey = path.join(s3Location, basename, basename)
  const originalMimetype = lookup(url)

  // download file and save to disk
  const d = moment().format('YYYY-MM-DD_ss')
  const uniqueId = `${basename}_${d}_${fieldId}`
  const filePath = path.resolve(IMAGE_TEMP_DIRECTORY, `${uniqueId}${extension}`)

  const resp = await axios({ url, responseType: 'stream', method: 'get' })
  const writeStream = fs.createWriteStream(filePath)

  await promisifyStreamPipe(resp.data, writeStream)
  let image = sharp(filePath)
  const metadata = await image.metadata()
  // force gc
  image = null

  // originalHalf
  let originalHalf = await sharp(filePath)
    .resize(Math.round(metadata.width / 2))
    .toBuffer()

  const originalHalfResult = await uploadBuffer(originalHalf, `${basekey}-original-half${extension}`, originalMimetype)
  originalHalf = null

  // webPFull
  let webPFull = await sharp(filePath)
    .toFormat('webp')
    .toBuffer()

  const webPFullResult = await uploadBuffer(webPFull, `${basekey}-full.webp`, 'image/webp')
  // force garbage collection
  webPFull = null

  // webPHalf
  let webPHalf = await sharp(filePath)
    .resize(Math.round(metadata.width / 2))
    .toFormat('webp')
    .toBuffer()

  const webPHalfResult = await uploadBuffer(webPHalf, `${basekey}-half.webp`, 'image/webp')
  // force garbage collection
  webPHalf = null

  try {
    fs.promises.unlink(filePath)
  } catch (err) {
    // log but don't throw
    logger(LOG_LEVELS.ERROR, `error deleting temp file for job ${job.id} in queue ${QUEUES.IMAGE_PROCESSING}, filename: ${filePath}`)
  }

  const formatData = {
    original: {
      full: url,
      half: originalHalfResult.Location,
      mimeType: originalMimetype
    },
    webp: {
      full: webPFullResult.Location,
      half: webPHalfResult.Location,
      mimeType: 'image/webp'
    }
  }

  return portwayAPI.updateFieldFormats(documentId, fieldId, orgId, formatData)
}

export default {
  createImageAlternatives
}
