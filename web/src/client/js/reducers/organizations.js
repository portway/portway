import { ActionTypes } from '../actions'

const initialState = {
  organizationsById: {},
  loading: {
    list: null,
    byId: {}
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
    default: {
      return state
    }
  }
}
