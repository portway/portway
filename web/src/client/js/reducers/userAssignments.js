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
    default:
      return { ...state }
  }
}
