import AWS from 'aws-sdk'
import fs from 'fs'
import { URL } from 'url'
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
  return s3ToCDNLink(res.Location)
}

// Get the Cloudfront url for the S3 url
function s3ToCDNLink(s3Location) {
  if (!CDN_HOSTNAME) return s3Location

  const parsedUrl = new URL(s3Location)
  const newUrl = new URL(parsedUrl.pathname, CDN_HOSTNAME)
  return newUrl.href
}
