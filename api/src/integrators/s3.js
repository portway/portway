import AWS from 'aws-sdk'
import ono from 'ono'

import { getHashIdFromOrgId } from '../libs/hashId'

const { S3_CONTENT_BUCKET, AWS_SES_REGION } = process.env

AWS.config.update({ region: AWS_SES_REGION })

const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

export const uploadContent = async function(documentId, orgId, file) {
  const hashId = getHashIdFromOrgId(orgId)

  let res
  try {
    res = await s3
      .upload({
        Bucket: S3_CONTENT_BUCKET,
        Key: `${hashId}/d/${documentId}/${Date.now()}-${file.originalname}`,
        ContentType: 'application/octet-stream',
        Body: file.buffer,
        ACL: 'public-read'
      })
      .promise()
  } catch (err) {
    throw ono(err, { code: 503 }, 'AWS s3 failed to upload file')
  }

  return res.Location
}
