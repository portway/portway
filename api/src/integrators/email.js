import AWS from 'aws-sdk'
import ono from 'ono'

const { AWS_SES_REGION, SENDER_EMAIL_ADDRESS } = process.env

AWS.config.update({ region: AWS_SES_REGION })

const SES = new AWS.SES({ apiVersion: '2010-12-01' })

// Create sendEmail params
const getSESParams = ({ toAddresses, textBody }) => {
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

export const sendSingleRecipientEmail = async function({ address, body }) {
  try {
    await SES.sendEmail(getSESParams({
      toAddresses: [address],
      textBody: body
    })).promise()
  } catch (err) {
    throw ono(err, { code: 503 }, 'AWS SES failed to send email')
  }
}
