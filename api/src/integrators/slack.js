import { IncomingWebhook } from '@slack/webhook'

const url = process.env.SLACK_WEBHOOK_URL || ''
const webhook = new IncomingWebhook(url)

const sendNotification = async function(message) {
  await webhook.send({
    text: message,
  })
}

export default {
  sendNotification
}