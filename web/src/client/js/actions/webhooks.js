import { Validation, ProjectWebhooks, WebhookDeliveries, Notifications } from './index'
import { formSubmitAction, formSucceededAction, formFailedAction } from './form'
import { fetch, add, remove, update, globalErrorCodes, validationCodes } from '../api'
import { NOTIFICATION_RESOURCE, NOTIFICATION_TYPES } from 'Shared/constants'

const DELIVERIES_PER_PAGE = 50 // this is a hard limit set by the API, I'd rather 100

// Deliveries
// We are only loading 1 page of 100 deliveries. We probably don't care about deliveries > DELIVERIES_PER_PAGE
// and don't really feel like supporting it
export const fetchWebhookDeliveries = (projectId, webhookId) => {
  return async (dispatch) => {
    dispatch(WebhookDeliveries.request(projectId, webhookId))
    const { data, status } = await fetch(
      `v1/projects/${projectId}/webhooks/${webhookId}/deliveries?page=1&perPage=${DELIVERIES_PER_PAGE}`
    )
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.PROJECT, status))
      return
    }
    dispatch(WebhookDeliveries.receive(projectId, webhookId, data))
  }
}

export const fetchProjectWebhooksWithLatestDeliveries = (projectId) => {
  return async (dispatch) => {
    dispatch(ProjectWebhooks.request(projectId))
    const { data, status } = await fetch(`v1/projects/${projectId}/webhooks`)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.PROJECT, status))
      return
    }
    // Get latest deliveries, and return an object key'd by webhook id
    const deliveries = await Promise.all(
      data.map(async (webhook) => {
        const { data: deliveryData } = await fetch(
          `v1/projects/${projectId}/webhooks/${webhook.id}/deliveries?page=1&perPage=1`
        )
        return deliveryData[0] // since we only have one item in the array
      })
    )
    dispatch(ProjectWebhooks.receive(projectId, data, deliveries))
  }
}

export const createProjectWebhook = (formId, projectId, body) => {
  return async (dispatch) => {
    dispatch(formSubmitAction(formId))
    dispatch(ProjectWebhooks.create(projectId))
    const { data, status } = await add(`v1/projects/${projectId}/webhooks`, body)
    if (globalErrorCodes.includes(status)) {
      dispatch(formFailedAction(formId))
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.PROJECT, status))
      return
    }
    if (validationCodes.includes(status)) {
      dispatch(formFailedAction(formId))
      dispatch(Validation.create('project', data, status))
    } else {
      dispatch(formSucceededAction(formId))
      dispatch(ProjectWebhooks.receiveOneCreated(data))
    }
  }
}

export const updateProjectWebhook = (projectId, webhookId, body) => {
  return async (dispatch) => {
    dispatch(ProjectWebhooks.initiateUpdate(projectId, webhookId))
    const { data, status } = await update(`v1/projects/${projectId}/webhooks/${webhookId}`, body)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.PROJECT, status))
      return
    }
    if (validationCodes.includes(status)) {
      dispatch(Validation.create('project', data, status))
    } else {
      dispatch(ProjectWebhooks.receiveOneUpdated(projectId, webhookId, data))
    }
  }
}

export const removeProjectWebhook = (projectId, webhookId) => {
  return async (dispatch) => {
    dispatch(ProjectWebhooks.initiateRemove(projectId, webhookId))
    const { data, status } = await remove(`v1/projects/${projectId}/webhooks/${webhookId}`)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.PROJECT, status))
      return
    }
    dispatch(ProjectWebhooks.removedOne(projectId, webhookId))
  }
}

