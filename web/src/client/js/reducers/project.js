import { ActionTypes } from '../actions'

const initialState = {
  projectById: {},
  currentProjectId: null,
  loading: {
    byId: {}
  }
}

export const project = (state = initialState, action) => {
  switch (action.type) {
    // Project
    case ActionTypes.REQUEST_PROJECT: {
      const loadingById = { ...state.loading.byId, [action.id]: false }
      return {
        ...state,
        currentProjectId: action.id,
        loading: { ...state.loading, byId: loadingById }
      }
    }
    case ActionTypes.RECEIVE_PROJECT: {
      const id = action.data.id
      const projectById = { ...state.projectById, [id]: action.data }
      const loadingById = { ...state.loading.byId, [id]: false }
      return { ...state, projectById, loading: { ...state.loading, byId: loadingById } }
    }
    default:
      return state
  }
}
