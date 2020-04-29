import { ActionTypes } from '../actions'

const initialState = {
  usersByProjectId: {},
  loading: {
    usersByProjectId: {}
  }
}

export const projectUsers = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_PROJECT_ASSIGNEES: {
      const usersByProjectId = { ...state.loading.usersByProjectId, [action.projectId]: true }
      return { ...state, loading: { ...state.loading, usersByProjectId } }
    }
    case ActionTypes.RECEIVE_PROJECT_ASSIGNEES: {
      const usersById = action.data.reduce((cur, assignment) => {
        return { ...cur, [assignment.userId]: assignment.user }
      }, {})

      const usersByProjectId = { ...state.usersByProjectId, [action.projectId]: usersById }
      const loadingById = { ...state.loading.usersByProjectId, [action.projectId]: false }
      return {
        ...state,
        usersByProjectId,
        loading: {
          ...state.loading,
          usersByProjectId: loadingById
        }
      }
    }
    case ActionTypes.INITIATE_PROJECT_ASSIGNEE_UPDATE: {
      const usersByProjectId = { ...state.loading.usersByProjectId, [action.projectId]: true }
      return { ...state, loading: { ...state.loading, usersByProjectId } }
    }
    case ActionTypes.RECEIVE_UPDATED_PROJECT_ASSIGNEE: {
      // Assignment changes, but we don't need to do anything here because we already have the user
      const usersByProjectId = { ...state.loading.usersByProjectId, [action.projectId]: false }
      return { ...state, loading: { ...state.loading, usersByProjectId } }
    }
    case ActionTypes.CREATE_PROJECT_ASSIGNEE: {
      const usersByProjectId = { ...state.loading.usersByProjectId, [action.projectId]: true }
      return { ...state, loading: { ...state.loading, usersByProjectId } }
    }
    case ActionTypes.RECEIVE_CREATED_PROJECT_ASSIGNEE: {
      const loadingById = { ...state.loading.usersByProjectId, [action.projectId]: false }
      const projectUsers = { ...state.usersByProjectId[action.projectId], [action.data.userId]: action.data.user }
      const usersByProjectId = { ...state.usersByProjectId, [action.projectId]: projectUsers }
      return {
        ...state,
        usersByProjectId,
        loading: {
          ...state.loading,
          usersByProjectId: loadingById
        }
      }
    }
    case ActionTypes.INITIATE_PROJECT_ASSIGNEE_REMOVE: {
      const usersByProjectId = { ...state.loading.usersByProjectId, [action.projectId]: true }
      return { ...state, loading: { ...state.loading, usersByProjectId } }
    }
    case ActionTypes.REMOVE_PROJECT_ASSIGNEE: {
      const loadingById = { ...state.loading.usersByProjectId, [action.projectId]: false }
      // in case it's undefined, default to an empty object
      const projectAssignees = state.usersByProjectId[action.projectId] || {}
      // eslint-disable-next-line no-unused-vars, no-undef
      const { [action.userId]: ___, ...restProjectAssignees } = projectAssignees
      const usersByProjectId = { ...state.usersByProjectId, [action.projectId]: restProjectAssignees }
      return {
        ...state,
        usersByProjectId,
        loading: {
          ...state.loading,
          usersByProjectId: loadingById
        }
      }
    }
    default:
      return { ...state }
  }
}
