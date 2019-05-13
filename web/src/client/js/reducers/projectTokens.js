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
      const { projectId } = action.data
      const loadingById = { ...state.tokensByProjectId, [projectId]: false }
      const projectToken = { ...state.tokensByProjectId[projectId], [action.data.id]: action.data }
      const tokensByProjectId = { ...state.tokensByProjectId, [projectId]: projectToken }
      return {
        ...state,
        tokensByProjectId,
        loading: {
          ...state.loading,
          tokensByProjectId: loadingById
        }
      }
    }
    case ActionTypes.INITIATE_PROJECT_TOKEN_REMOVE: {
      const tokensByProjectId = { ...state.tokensByProjectId, [action.projectId]: true }
      return { ...state, loading: { ...state.loading, tokensByProjectId } }
    }
    case ActionTypes.REMOVE_PROJECT_TOKEN: {
      const loadingById = { ...state.tokensByProjectId, [action.projectId]: false }
      // eslint-disable-next-line no-unused-vars, no-undef
      const { [action.tokenId]: ___, ...restProjectTokens } = state.tokensByProjectId[action.projectId]
      const tokensByProjectId = { ...state.tokensByProjectId, [action.projectId]: restProjectTokens }
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
