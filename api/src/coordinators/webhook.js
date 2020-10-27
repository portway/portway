
import axios from 'axios'

import BusinessDocument from '../businesstime/document'
import BusinessWebhook from '../businesstime/webhook'
import BusinessWebhookDelivery from '../businesstime/webhookDelivery'

import logger from '../integrators/logger'
import { LOG_LEVELS } from '../constants/logging'
import { HOOK_TYPES } from '../constants/hooks'

const sendPublishWebhook = async (docId, orgId) => {
  const docWithFields = await BusinessDocument.findByIdWithPublishedFields(docId, orgId)

  const payload = {
    document: docWithFields,
    event: HOOK_TYPES.PUBLISH
  }

  await sendWebhook(docWithFields.projectId, payload, orgId)
}

const sendUnpublishWebhook = async (docId, orgId) => {
  const docWithFields = await BusinessDocument.findByIdWithFields(docId, orgId)

  const payload = {
    document: docWithFields,
    event: HOOK_TYPES.UNPUBLISH
  }

  await sendWebhook(docWithFields.projectId, payload, orgId)
}

const sendWebhook = async (projectId, payload, orgId) => {
  const webhooks = await BusinessWebhook.findAllByProjectId(projectId, orgId)

  await Promise.all(webhooks.map(async (hook) => {
    if (hook.active) {
      let result

      try {
        result = await axios.post(hook.url, payload, {
          // Any response is valid in the sense we got a response code, so this ensures
          // axios won't throw an error unless no response was received
          validateStatus: () => true
        })
      } catch (e) {
        logger(LOG_LEVELS.ERROR, `Error sending webhook for org ${orgId} to url ${hook.url}`)
        logger(LOG_LEVELS.ERROR, e)
      }

      await BusinessWebhookDelivery.create({
        webhookId: hook.id,
        orgId,
        resultCode: result ? result.status : 500
      })

    }
  }))
}


const webhookCoordinator = {
  sendPublishWebhook,
  sendUnpublishWebhook
}

export default webhookCoordinator