import faker from 'faker'
import { getDb } from '../../dbConnector'
import constants from '../constants'

const getProjectData = function (override = {}) {
  const defaultProps = {
    url: faker.internet.url(),
    orgId: constants.ORG_ID,
    projectId: faker.random.number(100)
  }
  return { ...defaultProps, ...override }
}

const createMany = async function (numberOfWebhooks, override) {
  const db = getDb()
  const webhooks = Array(numberOfWebhooks).fill().map(() => getProjectData(override))
  return Promise.all(webhooks.map(webhookData => db.model('Webhook').create(webhookData)))
}

export default {
  createMany
}