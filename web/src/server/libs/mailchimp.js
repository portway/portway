import axios from 'axios'
import { LOG_LEVELS, MAILCHIMP_API_URL, MAILCHIMP_LIST_ID } from '../constants'
import logger from './logger'

const { MAILCHIMP_SECRET_KEY } = process.env

const joinList = async (email) => {
  const url = `${MAILCHIMP_API_URL}/3.0/lists/${MAILCHIMP_LIST_ID}/members`
  const body = {
    // eslint-disable-next-line camelcase
    email_address: email,
    status: 'subscribed',
    // eslint-disable-next-line camelcase
    tags: ['Website']
  }
  try {
    await axios.post(url, body, {
      auth: {
        username: 'PORTWAY',
        password: MAILCHIMP_SECRET_KEY
      }
    })
  } catch (err) {
    console.log(err)
    logger(LOG_LEVELS.INFO, { type: 'mailchimp', message: `There was an error adding user with email: ${email} to the list` })
  }
}

export default {
  joinList
}