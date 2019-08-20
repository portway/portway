import AWS from 'aws-sdk'
import ono from 'ono'

const { S3_IMAGE_BUCKET, AWS_SES_REGION } = process.env

AWS.config.update({ region: AWS_SES_REGION })

const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

export const uploadImage = async function(file) {
  let res
  try {
    res = await s3
      .upload({
        Bucket: S3_IMAGE_BUCKET,
        Key: file.originalname,
        ContentType: 'application/octet-stream',
        Body: file.buffer,
        ACL: 'public-read'
      })
      .promise()
  } catch (err) {
    throw ono(err, { code: 503 }, 'AWS s3 failed to upload file')
  }

  return res
}
