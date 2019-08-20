import AWS from 'aws-sdk'
import ono from 'ono'
import mime from 'mime-types'

const { S3_IMAGE_BUCKET, AWS_SES_REGION } = process.env

AWS.config.update({ region: AWS_SES_REGION })

const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

export const uploadFile = async function(file) {
  const type = mime.lookup(file.path)

  let res
  try {
    res = await s3.putObject({
      Bucket: S3_IMAGE_BUCKET,
      Key: Date.now(),
      ContentType: type
    })
  } catch (err) {
    throw ono(err, { code: 503 }, 'AWS s3 failed to upload file')
  }

  return res
}
