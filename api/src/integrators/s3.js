import AWS from 'aws-sdk'
import ono from 'ono'
import fs from 'fs'
import util from 'util'
import { URL } from 'url'
import { getHashIdFromOrgId } from '../libs/hashId'

const readFile = util.promisify(fs.readFile)
const unlink = util.promisify(fs.unlink)
const { S3_CONTENT_BUCKET, AWS_SES_REGION, CDN_HOSTNAME } = process.env

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
        ContentType: file.mimetype,
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
  return s3ToCDNLink(res.Location)
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
        ContentType: file.mimetype,
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

  return s3ToCDNLink(res.Location)
}

export const deleteContent = async function(key) {
  try {
    await s3
      .deleteObject({
        Bucket: S3_CONTENT_BUCKET,
        Key: key
      })
      .promise()
  } catch (err) {
    throw ono(err, { code: 503 }, 'AWS s3 failed to delete file')
  }

  console.info(`Successfully deleted S3 content with key: ${key}`)
}

// Get the Cloudfront url for the S3 url
function s3ToCDNLink(s3Location) {
  if (!CDN_HOSTNAME) return s3Location

  const parsedUrl = new URL(s3Location)
  const newUrl = new URL(parsedUrl.pathname, CDN_HOSTNAME)
  return newUrl.href
}
