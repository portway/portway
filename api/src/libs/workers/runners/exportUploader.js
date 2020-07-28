const { parentPort, workerData } = require('worker_threads')
const AWS = require('aws-sdk')
const fs = require('fs')
const { getHashIdFromOrgId } = require('../libs/hashId')
const { s3ToCDNLink } = require('../integrators/s3')

const { S3_CONTENT_BUCKET, AWS_SES_REGION } = process.env

AWS.config.update({ region: AWS_SES_REGION })
const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

const uploadFileToS3 = async function(orgId, filePath) {
  const file = await fs.promises.readFile(filePath)

  let res
  try {
    res = await s3
      .upload({
        Bucket: S3_CONTENT_BUCKET,
        Key: getHashIdFromOrgId(orgId),
        ContentType: file.mimetype,
        Body: file,
        ACL: 'public-read'
      })
      .promise()
  } catch (err) {
    throw new Error('AWS s3 failed to upload file')
  } finally {// async function, but don't await it, just fire and move on
    fs.promises.unlink(filePath)
  }
  console.log(res)
}

parentPort.postMessage(uploadFileToS3(workerData[0]))