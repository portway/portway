import AWS from 'aws-sdk'
import ono from 'ono'
import fs from 'fs'
import util from 'util'

const readFile = util.promisify(fs.readFile)
const unlink = util.promisify(fs.unlink)

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
        Body: await readFile(file.path),
        ACL: 'public-read'
      })
      .promise()
  } catch (err) {
    throw ono(err, { code: 503 }, 'AWS s3 failed to upload file')
  } finally {
    // async function, but don't await it, just fire and move on
    unlink(file.path)
  }

  return res.Location
}

export const uploadAvatar = async function({ orgId, userId, file }) {
  const hashId = getHashIdFromOrgId(orgId)

  let key
  let res

  if (userId) {
    key = `${hashId}/u/${userId}/${Date.now()}-${file.originalname}`
  } else {
    key = `${hashId}/o/${Date.now()}-${file.originalname}`
  }

  try {
    res = await s3
      .upload({
        Bucket: S3_CONTENT_BUCKET,
        Key: key,
        ContentType: 'application/octet-stream',
        Body: await readFile(file.path),
        ACL: 'public-read'
      })
      .promise()
  } catch (err) {
    throw ono(err, { code: 503 }, 'AWS s3 failed to upload file')
  } finally {
    // async function, but don't await it, just fire and move on
    unlink(file.path)
  }

  return res.Location
}
