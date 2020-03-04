import { IncomingWebhook } from '@slack/webhook'
import logger from './logger'
import { LOG_LEVELS } from '../constants'

const url = process.env.SLACK_WEBHOOK_URL || ''
const webhook = new IncomingWebhook(url)

const sendNotification = async function(message) {
  try {
    await webhook.send({
      text: message
    })
  } catch (err) {
    // swallow errors here and log, don't want to cause requests to fail because of a bad slack integration
    logger(LOG_LEVELS.WARNING, {
      type: 'slack integration',
      slackMessage: message,
      message: err.message
    })
  }
}

export default {
  sendNotification
}
