
import axios from 'axios'

const ZENDESK_API_TOKEN = process.env.ZENDESK_API_TOKEN
const ZENDESK_REQUEST_ENDPOINT = 'https://portway.zendesk.com/api/v2/requests'

export default async function addRequest(email, message, company, name, subject) {
  try {
    await axios({
      method: 'post',
      url: ZENDESK_REQUEST_ENDPOINT,
      data: {
        request: {
          requester: { name, email },
          subject,
          comment: { body: `Company: ${company}\n\n${message}` }
        }
      },
      headers: {
        'Authorization': `Basic ${zendeskToken(email)}`
      }
    })
  } catch (e) {
    if (typeof e.toJSON === 'function') {
      console.error(e.toJSON())
    } else {
      console.error(e)
    }
  }
}

function zendeskToken(email) {
  const buffer = Buffer.from(`${email}/token:${ZENDESK_API_TOKEN}`)
  return buffer.toString('base64')
}
