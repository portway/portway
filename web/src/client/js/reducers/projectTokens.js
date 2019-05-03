import { ActionTypes } from '../actions'

const initialState = {
  tokensByProjectId: {},
  loading: {
    tokensByProjectId: {}
  }
}

export const projectTokens = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_PROJECT_TOKENS: {
      const tokensByProjectId = { ...state.tokensByProjectId, [action.projectId]: true }
      return { ...state, loading: { ...state.loading, tokensByProjectId } }
    }
    case ActionTypes.RECEIVE_PROJECT_TOKENS: {
      const tokensObject = action.data.reduce((object, token) => {
        object[token.id] = token
        return object
      }, {})
      const tokensByProjectId = { ...state.tokensByProjectId, [action.projectId]: tokensObject }
      const loadingById = { ...state.tokensByProjectId, [action.projectId]: false }
      return {
        ...state,
        tokensByProjectId,
        loading: {
          ...state.loading,
          tokensByProjectId: loadingById
        }
      }
    }
    case ActionTypes.CREATE_PROJECT_TOKEN: {
      const tokensByProjectId = { ...state.tokensByProjectId, [action.projectId]: true }
      return { ...state, loading: { ...state.loading, tokensByProjectId } }
    }
    case ActionTypes.RECEIVE_CREATED_PROJECT_TOKEN: {
      const loadingById = { ...state.tokensByProjectId, [action.projectId]: false }
      const projectToken = { ...state.tokensByProjectId[action.projectId], [action.data.id]: action.data }
      const tokensByProjectId = { ...state.tokensByProjectId, [action.projectId]: projectToken }
      return {
        ...state,
        tokensByProjectId,
        loading: {
          ...state.loading,
          tokensByProjectId: loadingById
        }
      }
    }
    default: {
      return { ...state }
    }
  }
}
