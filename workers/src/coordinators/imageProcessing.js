import sharp from 'sharp'
import axios from 'axios'
import { uploadBuffer } from '../integrators/s3'
import path from 'path'

// TODO: update field with new image urls
const createImageAlternatives = async function(url, documentId, fieldId) {
  const resp = await axios({ url, responseType: 'arraybuffer', method: 'get' })
  const s3Location = url.split('/').slice(3, -1).join('/')
  const extension = path.extname(url)
  const basename = path.basename(url, extension)

  const image = sharp(resp.data)
  const metadata = await image.metadata()
  const basekey = path.join(s3Location, basename, basename)

  // webPFull
  const webPFull = await image
    .toFormat('webp')
    .toBuffer()

  // webPHalf
  const webPHalf = await image
    .resize(Math.round(metadata.width / 2))
    .toFormat('webp')
    .toBuffer()

  // pngFull
  const pngFull = await image
    .toFormat('png')
    .toBuffer()

  // pngHalf
  const pngHalf = await image
    .resize(Math.round(metadata.width / 2))
    .toFormat('png')
    .toBuffer()
  
  const uploadResults = await Promise.all([
    uploadBuffer(webPFull, `${basekey}-full.webp`, 'image/webp'),
    uploadBuffer(webPHalf, `${basekey}-half.webp`, 'image/webp'),
    uploadBuffer(pngFull, `${basekey}-full.png`, 'image/png'),
    uploadBuffer(pngHalf, `${basekey}-half.png`, 'image/png')
  ])

  return {
    webPFull: uploadResults[0].Location,
    webPHalf: uploadResults[1].Location,
    pngFull: uploadResults[2].Location,
    pngHalf: uploadResults[3].Location
  }
}

export default {
  createImageAlternatives
}
