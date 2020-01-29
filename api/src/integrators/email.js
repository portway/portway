import AWS from 'aws-sdk'
import ono from 'ono'
import { BOUNCE_NOTIFICATION_EMAIL } from '../constants/email'

const { AWS_SES_REGION, SENDER_EMAIL_ADDRESS } = process.env

AWS.config.update({ region: AWS_SES_REGION })

const SES = new AWS.SES({ apiVersion: '2010-12-01' })

// Create sendEmail params
const getSESParams = ({ toAddresses, textBody, htmlBody, subject }) => {
  return {
    Destination: {
      /* required */
      CcAddresses: [],
      ToAddresses: toAddresses
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: htmlBody
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: SENDER_EMAIL_ADDRESS /* required */,
    ReplyToAddresses: [
      /* more items */
    ],
    // SES will use this address to alert us of bounce/complaint emails
    ReturnPath: BOUNCE_NOTIFICATION_EMAIL
  }
}

export const sendSingleRecipientEmail = async function({ address, textBody, htmlBody, subject }) {
  try {
    await SES.sendEmail(getSESParams({
      toAddresses: [address],
      textBody,
      htmlBody,
      subject
    })).promise()
  } catch (err) {
    throw ono(err, { code: 503 }, 'AWS SES failed to send email')
  }
}
