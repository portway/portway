import AWS from 'aws-sdk'
import fs from 'fs'
import ono from 'ono'

const { S3_CONTENT_BUCKET, AWS_SES_REGION, CDN_HOSTNAME } = process.env

AWS.config.update({ region: AWS_SES_REGION })
const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

export const uploadExportZip = async function(filePath, uniqueId) {
  let res
  try {
    res = await s3
      .upload({
        Bucket: S3_CONTENT_BUCKET,
        Key: `exports/${uniqueId}.zip`,
        ContentType: 'application/zip',
        Body: await fs.promises.readFile(filePath),
        ACL: 'public-read'
      })
      .promise()
  } catch (err) {
    throw ono(err, { code: 503 }, 'AWS s3 failed to upload file')
  } finally {
    // async function, but don't await it, just fire and move on
    fs.promises.unlink(filePath)
  }
  return res.Location
}

export const uploadBuffer = async function (buffer, key, contentType) {

  const params = {
    Bucket: S3_CONTENT_BUCKET,
    Key: key,
    ContentType: contentType,
    Body: buffer,
    ACL: 'public-read'
  }

  return s3.upload(params).promise()
}

// const promisifyStreamPipe = (readStream, writeStream) => {
//   return new Promise((resolve, reject) => {
//     readStream.on('error', reject)
//     writeStream.on('error', reject)
//     writeStream.on('finish', resolve)
//     readStream.pipe(writeStream)
//   })
// } 
