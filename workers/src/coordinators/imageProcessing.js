import sharp from 'sharp'
import axios from 'axios'
import { uploadStream } from '../integrators/s3'
import { lookup } from 'mime-types'
import path from 'path'

const createImageAlternatives = async function(url, documentId, fieldId) {
  const resp = await axios({ url, responseType: 'stream', method: 'get' })
  const mimeType = lookup(url)
  console.log("HEHEHEHEHEHHEH")
  console.log(mimeType)
  const s3Location = url.split('/').slice(3, -1).join('/')
  const extension = path.extname(url)
  const basename = path.basename(url, extension)

  console.log(extension)
  console.log(basename)

  
  // Read image data from readableStream,
  // resize to 300 pixels wide,
  // emit an 'info' event with calculated dimensions
  // and finally write image data to writableStream
  var webpTransformer = sharp()
    .metadata()
    .then((metadata) => {
      console.log(metadata)
    })
    .webp({ lossless: true })
    .resize(300)
    .on('info', function (info) {
      console.log(info)
      console.log('Image height is ' + info.height);
    })
  
  const readStream = resp.data.pipe(transformer)
  const result = await uploadStream(readStream, path.join(s3Location, basename, `${basename}-300${extension}`), mimeType)
  console.log(result)
}

export default {
  createImageAlternatives
}
