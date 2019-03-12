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
      console.info('Requesting project', action.id)
      const loadingById = { ...state.loading.byId }
      loadingById[action.id] = false
      return {
        ...state,
        currentProjectId: action.id,
        loading: { ...state.loading, byId: loadingById }
      }
    }
    case ActionTypes.RECEIVE_PROJECT: {
      const id = action.data.id
      const projectById = { ...state.projectById }
      projectById[id] = action.data
      const loadingById = { ...state.loading.byId }
      loadingById[id] = false
      return { ...state, projectById, loading: { ...state.loading, byId: loadingById } }
    }
    default:
      return state
  }
}
