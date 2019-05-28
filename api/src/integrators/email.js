import AWS from 'aws-sdk'
import ono from 'ono'

const { AWS_SES_REGION, SENDER_EMAIL_ADDRESS } = process.env

AWS.config.update({ region: AWS_SES_REGION })

const SES = new AWS.SES({ apiVersion: '2010-12-01' })

// Create sendEmail params
const getSESParams = ({ toAddresses, textBody, htmlBody }) => {
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
        },
        Text: {
          Charset: 'UTF-8',
          Data: textBody
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Test email'
      }
    },
    Source: SENDER_EMAIL_ADDRESS /* required */,
    ReplyToAddresses: [
      /* more items */
    ]
  }
}

export const sendSingleRecipientEmail = async function({ address, textBody, htmlBody }) {
  try {
    await SES.sendEmail(getSESParams({
      toAddresses: [address],
      textBody,
      Text: {
          Charset: 'UTF-8',
          Data: textBody
        },
      htmlBody,
      Text: {
          Charset: 'UTF-8',
          Data: textBody
        }
    })).promise()
  } catch (err) {
    throw ono(err, { code: 503 }, 'AWS SES failed to send email')
  }
}
