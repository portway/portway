import { ActionTypes } from '../actions'

const initialState = {
  assignmentsByUserId: {},
  loading: {
    byUserId: {}
  }
}

export const userAssignments = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_USER_PROJECT_ASSIGNMENTS: {
      const loadingByUserId = { ...state.loading.byUserId, [action.userId]: true }
      return { ...state, loading: { ...state.loading, byUserId: loadingByUserId } }
    }
    case ActionTypes.RECEIVE_USER_PROJECT_ASSIGNMENTS: {
      const userAssignmentsByProjectId = action.data.reduce((assignments, assignment) => {
        return { ...assignments, [assignment.projectId]: assignment }
      }, {})
      const assignmentsByUserId = {
        ...state.assignmentsByUserId,
        [action.userId]: userAssignmentsByProjectId
      }
      const loadingByUserId = { ...state.loading.byUserId, [action.userId]: false }
      return {
        ...state,
        assignmentsByUserId,
        loading: {
          ...state.loading,
          byUserId: loadingByUserId
        }
      }
    }
    case ActionTypes.REMOVE_PROJECT_ASSIGNEE: {
      // in case it's undefined, default to an empty object
      const userAssignments = state.assignmentsByUserId[action.userId] || {}
      // eslint-disable-next-line no-unused-vars, no-undef
      const { [action.projectId]: ___, ...restUserAssignments } = userAssignments
      const assignmentsByUserId = { ...state.assignmentsByUserId, [action.userId]: restUserAssignments }
      return {
        ...state,
        assignmentsByUserId
      }
    }

    // When a project is created, wipe out userAssignments and set loading to null
    // to force a refetch
    case ActionTypes.RECEIVE_CREATED_PROJECT: {
      return {
        assignmentsByUserId: {},
        loading: {
          byUserId: {}
        }
      }
    }

    default:
      return { ...state }
  }
}
