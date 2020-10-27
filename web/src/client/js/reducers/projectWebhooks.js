import { ActionTypes } from '../actions'

const initialState = {
  deliveriesByProjectId: {},
  recentDeliveriesByProjectId: {},
  webhooksByProjectId: {},
  loading: {
    deliveriesByWebhookId: {},
    webhooksByProjectId: {},
  }
}

export const projectWebhooks = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_PROJECT_WEBHOOKS: {
      const webhooksByProjectId = { ...state.webhooksByProjectId, [action.projectId]: true }
      return { ...state, loading: { ...state.loading, webhooksByProjectId } }
    }
    case ActionTypes.RECEIVE_PROJECT_WEBHOOKS: {
      const webhooksObject = action.data.reduce((object, webhook) => {
        object[webhook.id] = webhook
        return object
      }, {})
      // Overwrite recent deliveries each time we load a webhooks list
      const recentDeliveries = action.deliveries.reduce((object, delivery) => {
        if (delivery) {
          object[delivery.webhookId] = delivery
        }
        return object
      }, {})
      const recentDeliveriesByProjectId = { ...state.recentDeliveriesByProjectId, [action.projectId]: recentDeliveries }
      const webhooksByProjectId = { ...state.webhooksByProjectId, [action.projectId]: webhooksObject }
      const loadingById = { ...state.webhooksByProjectId, [action.projectId]: false }
      return {
        ...state,
        webhooksByProjectId,
        recentDeliveriesByProjectId,
        loading: {
          ...state.loading,
          webhooksByProjectId: loadingById
        }
      }
    }
    case ActionTypes.CREATE_PROJECT_WEBHOOK: {
      const webhooksByProjectId = { ...state.webhooksByProjectId, [action.projectId]: true }
      return { ...state, loading: { ...state.loading, webhooksByProjectId } }
    }
    case ActionTypes.RECEIVE_CREATED_PROJECT_WEBHOOK: {
      const { projectId } = action.data
      const loadingById = { ...state.webhooksByProjectId, [projectId]: false }
      const projectWebhook = { ...state.webhooksByProjectId[projectId], [action.data.id]: action.data }
      const webhooksByProjectId = { ...state.webhooksByProjectId, [projectId]: projectWebhook }
      return {
        ...state,
        webhooksByProjectId,
        loading: {
          ...state.loading,
          webhooksByProjectId: loadingById
        }
      }
    }
    case ActionTypes.INITIATE_PROJECT_WEBHOOK_UPDATE: {
      const { projectId } = action
      const webhooksByProjectId = { ...state.loading.webhooksByProjectId, [projectId]: true }
      return { ...state, loading: { ...state.loading, webhooksByProjectId: webhooksByProjectId } }
    }
    case ActionTypes.RECEIVE_UPDATED_PROJECT_WEBHOOK: {
      const { projectId, webhookId } = action
      const loadingById = { ...state.webhooksByProjectId, [projectId]: false }
      const projectWebhook = { ...state.webhooksByProjectId[projectId], [webhookId]: action.data }
      const webhooksByProjectId = { ...state.webhooksByProjectId, [projectId]: projectWebhook }
      return {
        ...state,
        webhooksByProjectId,
        loading: {
          ...state.loading,
          webhooksByProjectId: loadingById
        }
      }
    }
    case ActionTypes.INITIATE_PROJECT_WEBHOOK_REMOVE: {
      const webhooksByProjectId = { ...state.webhooksByProjectId, [action.projectId]: true }
      return { ...state, loading: { ...state.loading, webhooksByProjectId } }
    }
    case ActionTypes.REMOVE_PROJECT_WEBHOOK: {
      const loadingById = { ...state.webhooksByProjectId, [action.projectId]: false }
      // eslint-disable-next-line no-unused-vars, no-undef
      const { [action.webhookId]: ___, ...restProjectWebhooks } = state.webhooksByProjectId[action.projectId]
      const webhooksByProjectId = { ...state.webhooksByProjectId, [action.projectId]: restProjectWebhooks }
      return {
        ...state,
        webhooksByProjectId,
        loading: {
          ...state.loading,
          webhooksByProjectId: loadingById
        }
      }
    }

    // Webhook Deliveries
    case ActionTypes.REQUEST_WEBHOOK_DELIVERIES: {
      const deliveriesByWebhookId = { ...state.loading.deliveriesByWebhookId, [action.webhookId]: true }
      return { ...state, loading: { ...state.loading, deliveriesByWebhookId } }
    }
    case ActionTypes.RECEIVE_WEBHOOK_DELIVERIES: {
      // We want to nest state by projectId then webhookId
      const deliveriesByProjectId = { ...state.deliveriesByProjectId }
      deliveriesByProjectId[action.projectId] = { ...deliveriesByProjectId[action.projectId], [action.webhookId]: action.data }

      return {
        ...state,
        deliveriesByProjectId,
        loading: {
          ...state.loading,
          deliveriesByWebhookId: {
            ...state.loading.deliveriesByWebhookId,
            [action.webhookId]: false
          }
        }
      }
    }
    default: {
      return { ...state }
    }
  }
}
