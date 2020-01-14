
import axios from 'axios'

const ZENDESK_API_TOKEN = process.env.ZENDESK_API_TOKEN
const ZENDESK_REQUEST_ENDPOINT = 'https://portway.zendesk.com/api/v2/requests.json'

export default function addRequest(email, message, company, name, subject, type) {
  try {
    axios({
      method: 'post',
      url: ZENDESK_REQUEST_ENDPOINT,
      data: {
        request: {
          requester: { name, email },
          subject,
          comment: { body: `Company: ${company}\nType: ${type}\n\n${message}` }
        }
      },
      auth: {
        username: zendeskToken(email)
      }
    })
  } catch (e) {
    console.error(e)
  }
}

function zendeskToken(email) {
  return `${email}/token:${ZENDESK_API_TOKEN}`
}