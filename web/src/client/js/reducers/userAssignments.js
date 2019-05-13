import { ActionTypes } from '../actions'

const initialState = {
  assignmentsByUserId: {},
  loading: {
    assignmentsByUserId: {}
  }
}

export const userAssignments = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_CREATED_PROJECT: {
      const assignmentsByUserId = { ...state.loading.assignmentsByUserId, [action.userId]: null }
      return { ...state, loading: { ...state.loading, assignmentsByUserId } }
    }
    case ActionTypes.REQUEST_USER_PROJECT_ASSIGNMENTS: {
      const assignmentsByUserId = { ...state.loading.assignmentsByUserId, [action.userId]: true }
      return { ...state, loading: { ...state.loading, assignmentsByUserId } }
    }
    case ActionTypes.RECEIVE_USER_PROJECT_ASSIGNMENTS: {
      const userAssignmentsByProjectId = action.data.reduce((assignments, assignment) => {
        return { ...assignments, [assignment.projectId]: assignment }
      }, {})
      const assignmentsByUserId = {
        ...state.assignmentsByUserId,
        [action.userId]: userAssignmentsByProjectId
      }
      const loadingById = { ...state.loading.assignmentsByUserId, [action.userId]: false }
      return {
        ...state,
        assignmentsByUserId,
        loading: {
          ...state.loading,
          assignmentsByUserId: loadingById
        }
      }
    }
    default:
      return { ...state }
  }
}
