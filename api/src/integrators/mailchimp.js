import axios from 'axios'
import { LOG_LEVELS } from '../constants/logging'
import logger from '../integrators/logger'

const { MAILCHIMP_SECRET_KEY } = process.env
const MAILCHIMP_API_URL = 'https://us19.api.mailchimp.com'
const MAILCHIMP_LIST_ID = 'c1174861df'

const joinList = async (email, name) => {
  const url = `${MAILCHIMP_API_URL}/3.0/lists/${MAILCHIMP_LIST_ID}/members`
  const body = {
    // eslint-disable-next-line camelcase
    email_address: email,
    status: 'subscribed',
    // eslint-disable-next-line camelcase
    merge_fields: { FULLNAME: name },
    tags: ['Account Signup']
  }
  try {
    await axios.post(url, body, {
      auth: {
        username: 'PORTWAY',
        password: MAILCHIMP_SECRET_KEY
      }
    })
  } catch (err) {
    logger(LOG_LEVELS.INFO, { type: 'mailchimp', message: `There was an error adding user with email: ${email} to the list` })
  }
}

export default {
  joinList
}