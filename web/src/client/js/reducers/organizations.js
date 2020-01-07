import { ActionTypes } from '../actions'

const initialState = {
  currentOrganizationId: null,
  organizationsById: {},
  organizationsBillingById: {},
  seatsById: {},
  loading: {
    list: null,
    byId: {},
    billingById: {},
    seatsById: {}
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
      const seatsById = { ...state.seatsById }
      if (seatsById[id]) {
        seatsById[id].totalSeats = seats
      }
      const organizationsBillingById = { ...state.organizationsBillingById, [id]: organizationToUpdate }
      return {
        ...state,
        organizationsBillingById,
        seatsById,
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
      const seatsByIdLoading = { ...state.loading.seatsById, [action.id]: false }
      const { usedSeats, totalSeats, includedSeats } = action.data.subscription
      const seats = { usedSeats, totalSeats, includedSeats }
      const seatsById = { ...state.seatsById, [action.id]: seats }
      return {
        ...state,
        organizationsBillingById,
        seatsById,
        loading: { ...state.loading, billingById, seatsById: seatsByIdLoading }
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

    case ActionTypes.REQUEST_ORGANIZATION_SEATS: {
      const id = action.id
      const seatsById = { ...state.loading.seatsById, [id]: true }

      return {
        ...state,
        loading: { ...state.loading, seatsById }
      }
    }

    case ActionTypes.RECEIVE_ORGANIZATION_SEATS: {
      const { id } = action
      const seatsById = { ...state.seatsById, [id]: action.seats }
      const loadingById = { ...state.loading.seatsById, [id]: false }
      return {
        ...state,
        seatsById,
        loading: {
          ...state.loading,
          seatsById: loadingById
        }
      }
    }

    case ActionTypes.REMOVE_USER:
    case ActionTypes.RECEIVE_CREATED_USER: {
      const id = state.currentOrganizationId
      const seatsById = { ...state.seatsById }
      const seatsByIdLoading = { ...state.loading.seatsById }
      if (seatsById[id]) {
        delete seatsById[id]
        delete seatsByIdLoading[id]
      }
      return { ...state, seatsById, loading: { ...state.loading, seatsById: seatsByIdLoading } }
    }

    // Org removal
    case ActionTypes.INITIATE_ORGANIZATION_REMOVAL: {
      return {
        ...state
      }
    }

    case ActionTypes.RECEIVE_REMOVED_ORGANIZATION: {
      return {
        ...state
      }
    }

    default: {
      return state
    }
  }
}
