import sharp from 'sharp'
import axios from 'axios'
import { uploadBuffer } from '../integrators/s3'
import path from 'path'
import { lookup } from 'mime-types'
import fs from 'fs'
import { promisifyStreamPipe } from '../libs/utils'
import moment from 'moment'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

sharp.cache(false)
sharp.concurrency(0)
sharp.simd(false)

const IMAGE_TEMP_DIRECTORY = process.env.EXPORT_TEMP_DIRECTORY || 'temp/'

// TODO: update field with new image urls
const createImageAlternatives = async function(url, documentId, fieldId) {
  console.log("made it here")
  const s3Location = url.split('/').slice(3, -1).join('/')
  const extension = path.extname(url)
  const basename = path.basename(url, extension)
  const basekey = path.join(s3Location, basename, basename)
  const originalMimetype = lookup(url)

  // download file and save to disk
  const d = moment().format('YYYY-MM-DD_ss')
  const uniqueId = `${basename}_${d}_${fieldId}`
  const directoryPath = path.resolve(IMAGE_TEMP_DIRECTORY, uniqueId)
  const filePath = path.resolve(directoryPath, `${basename}${extension}`)

  await fs.promises.mkdir(directoryPath)

  const resp = await axios({ url, responseType: 'stream', method: 'get' })
  const writeStream = fs.createWriteStream(filePath)
  await promisifyStreamPipe(resp.data, writeStream)
  console.log('here')
  let image = sharp(filePath)
  const metadata = await image.metadata()
  // force gc
  image = null
  console.log('uploading original half')
  // originalHalf
  let originalHalf = await sharp(filePath)
    .resize(Math.round(metadata.width / 2))
    .toBuffer()

  const originalHalfResult = await uploadBuffer(originalHalf, `${basekey}-original-half${extension}`, originalMimetype)
  originalHalf = null
  console.log('webp full')
  await sleep(10000) 
  // webPFull
  let webPFull = await sharp(filePath)
    .toFormat('webp')
    .toBuffer()

  const webPFullResult = await uploadBuffer(webPFull, `${basekey}-full.webp`, 'image/webp')
  webPFull = null

  console.log('web p half')
  // webPHalf
  let webPHalf = await sharp(filePath)
    .resize(Math.round(metadata.width / 2))
    .toFormat('webp')
    .toBuffer()

  const webPHalfResult = await uploadBuffer(webPHalf, `${basekey}-half.webp`, 'image/webp')
  webPHalf = null
  console.log('avif full')

  await sleep(10000) 
  // avifFull
  let avifFull = await sharp(filePath)
    .toFormat('avif')
    .toBuffer()
  console.log('beginning upload')
  const avifFullResult = await uploadBuffer(avifFull, `${basekey}-full.avif`, 'image/avif')
  avifFull = null
  console.log('avif half')
  // avifHalf
  let avifHalf = await sharp(filePath)
    .resize(Math.round(metadata.width / 2))
    .toFormat('avif')
    .toBuffer()

  const avifHalfResult = await uploadBuffer(avifHalf, `${basekey}-half.avif`, 'image/avif')
  avifHalf = null
  
  // const uploadResults = await Promise.all([
  //   uploadStream(readStream.pipe(originalHalf), `${basekey}-original-half${extension}`, originalMimetype),
  //   uploadStream(readStream.pipe(webPFull), `${basekey}-full.webp`, 'image/webp'),
  //   uploadStream(readStream.pipe(webPHalf), `${basekey}-half.webp`, 'image/webp'),
  //   uploadStream(readStream.pipe(avifFull), `${basekey}-full.avif`, 'image/avif'),
  //   uploadStream(readStream.pipe(avifHalf), `${basekey}-half.avif`, 'image/avif')
  // ])

  return {
    originalHalf: originalHalfResult,
    webPFull: webPFullResult,
    webPHalf: webPHalfResult,
    avifFull: avifFullResult,
    avifHalf: avifHalfResult
  }
}

export default {
  createImageAlternatives
}
