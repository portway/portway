import { ActionTypes } from '../actions'

const initialState = {
  currentOrganizationId: null,
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
      const currentOrganizationId = id
      const organizationsById = { ...state.organizationsById, [id]: action.data }
      const loadingById = { ...state.loading.byId, [id]: false }
      return {
        ...state,
        currentOrganizationId,
        organizationsById,
        loading: {
          ...state.loading,
          byId: loadingById
        }
      }
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
    case ActionTypes.RECEIVE_UPDATED_ORGANIZATION_AVATAR: {
      const { id, data } = action
      const updatedOrganization = { ...state.organizationsById[id], avatar: data.avatar }
      const organizationsById = { ...state.organizationsById, [id]: updatedOrganization }
      const byId = { ...state.loading.byId, [id]: false }
      return {
        ...state,
        organizationsById,
        loading: {
          ...state.loading,
          byId: byId
        }
      }
    }

    // Org plan
    case ActionTypes.RECEIVE_UPDATED_ORGANIZATION_PLAN: {
      const { id, plan } = action
      const updatedOrganization = { ...state.organizationsById[id], plan }
      const organizationsById = { ...state.organizationsById, [id]: updatedOrganization }

      // when a plan is updated, clear out the billing info to trigger a re-fetch
      // eslint-disable-next-line no-unused-vars
      const { [id]: ___, ...restOrganizationsBillingById } = state.organizationsBillingById

      const billingLoadingById = { ...state.loading.billingById, [id]: undefined }

      return {
        ...state,
        organizationsById,
        organizationsBillingById: restOrganizationsBillingById,
        loading: { ...state.loading, billingById: billingLoadingById }
      }
    }

    // Org seats
    case ActionTypes.INITIATE_ORGANIZATION_SEATS_UPDATE: {
      const billingById = { ...state.loading.billingById, [action.id]: true }
      return {
        ...state,
        loading: { ...state.loading, billingById }
      }
    }
    case ActionTypes.RECEIVE_UPDATED_ORGANIZATION_SEATS: {
      const { id, seats } = action
      const billingById = { ...state.loading.billingById, [id]: false }
      const organizationToUpdate = { ...state.organizationsBillingById[id] }
      organizationToUpdate.subscription.totalSeats = seats
      const organizationsBillingById = { ...state.organizationsBillingById, [id]: organizationToUpdate }
      return {
        ...state,
        organizationsBillingById,
        loading: { ...state.loading, billingById }
      }
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
