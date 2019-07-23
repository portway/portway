import { ActionTypes } from '../actions'

const initialState = {
  organizationsById: {},
  organizationsBillingById: {},
  loading: {
    list: null,
    byId: {},
    billingById: {}
  }
}

export const organizations = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_ORGANIZATION: {
      const loadingById = { ...state.loading.byId, [action.id]: true }
      return {
        ...state,
        loading: { ...state.loading, byId: loadingById }
      }
    }
    case ActionTypes.RECEIVE_ORGANIZATION: {
      const id = action.data.id
      const organizationsById = { ...state.organizationsById, [id]: action.data }
      const loadingById = { ...state.loading.byId, [id]: false }
      return { ...state, organizationsById, loading: { ...state.loading, byId: loadingById } }
    }
    case ActionTypes.INITIATE_ORGANIZATION_UPDATE: {
      const id = action.id
      const byId = { ...state.loading.byId, [id]: true }
      return { ...state, loading: { ...state.loading, byId: byId } }
    }
    case ActionTypes.RECEIVE_UPDATED_ORGANIZATION: {
      const id = action.data.id
      const organizationsById = { ...state.organizationsById, [id]: action.data }
      const byId = { ...state.loading.byId, [id]: false }
      return { ...state, organizationsById, loading: { ...state.loading, byId: byId } }
    }

    // Org billing
    case ActionTypes.REQUEST_ORGANIZATION_BILLING: {
      const id = action.id
      const billingById = { ...state.loading.billingById, [id]: true }
      return {
        ...state,
        loading: { ...state.loading, billingById }
      }
    }
    case ActionTypes.RECEIVE_ORGANIZATION_BILLING:
    case ActionTypes.RECEIVE_UPDATED_ORGANIZATION_BILLING: {
      const billingById = { ...state.loading.billingById, [action.id]: false }
      const organizationsBillingById = { ...state.organizationsBillingById, [action.id]: action.data }
      return {
        ...state,
        organizationsBillingById,
        loading: { ...state.loading, billingById }
      }
    }
    case ActionTypes.INITIATE_ORGANIZATION_BILLING_UPDATE: {
      const id = action.id
      const billingById = { ...state.loading.billingById, [id]: true }
      return {
        ...state,
        loading: { ...state.loading, billingById }
      }
    }

    default: {
      return state
    }
  }
}
