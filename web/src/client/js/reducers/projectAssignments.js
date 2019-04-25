import { ActionTypes } from '../actions'

const initialState = {
  assignmentsByProjectId: {},
  loading: {
    assignmentsByProjectId: {}
  }
}

export const projectAssignments = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_PROJECT_ASSIGNEES: {
      const assignmentsByProjectId = { ...state.assignmentsByProjectId, [action.projectId]: true }
      return { ...state, loading: { ...state.loading, assignmentsByProjectId } }
    }
    case ActionTypes.RECEIVE_PROJECT_ASSIGNEES: {
      const assignmentsObject = action.data.reduce((object, assignment) => {
        object[assignment.userId] = assignment
        return object
      }, {})
      const assignmentsByProjectId = { ...state.assignmentsByProjectId, [action.projectId]: assignmentsObject }
      const loadingById = { ...state.assignmentsByProjectId, [action.projectId]: false }
      return {
        ...state,
        assignmentsByProjectId,
        loading: {
          ...state.loading,
          assignmentsByProjectId: loadingById
        }
      }
    }
    case ActionTypes.INITIATE_PROJECT_ASSIGNEE_UPDATE: {
      const assignmentsByProjectId = { ...state.assignmentsByProjectId, [action.projectId]: true }
      return { ...state, loading: { ...state.loading, assignmentsByProjectId } }
    }
    case ActionTypes.RECEIVE_UPDATED_PROJECT_ASSIGNEE: {
      const loadingById = { ...state.assignmentsByProjectId, [action.data.projectId]: false }
      const updatedAssignment = { ...state.assignmentsByProjectId[action.data.projectId][action.data.userId] = action.data }
      return {
        ...state,
        assignmentsByProjectId: {
          ...state.assignmentsByProjectId,
          [action.data.userId]: updatedAssignment
        },
        loading: {
          ...state.loading,
          assignmentsByProjectId: loadingById
        }
      }
    }
    case ActionTypes.CREATE_PROJECT_ASSIGNEE: {
      const assignmentsByProjectId = { ...state.assignmentsByProjectId, [action.projectId]: true }
      return { ...state, loading: { ...state.loading, assignmentsByProjectId } }
    }
    case ActionTypes.RECEIVE_CREATED_PROJECT_ASSIGNEE: {
      const loadingById = { ...state.assignmentsByProjectId, [action.projectId]: false }
      const projectAssignment = { ...state.assignmentsByProjectId[action.projectId], [action.data.userId]: action.data }
      const assignmentsByProjectId = { ...state.assignmentsByProjectId, [action.projectId]: projectAssignment }
      return {
        ...state,
        assignmentsByProjectId,
        loading: {
          ...state.loading,
          assignmentsByProjectId: loadingById
        }
      }
    }
    case ActionTypes.INITIATE_PROJECT_ASSIGNEE_REMOVE: {
      const assignmentsByProjectId = { ...state.assignmentsByProjectId, [action.projectId]: true }
      return { ...state, loading: { ...state.loading, assignmentsByProjectId } }
    }
    case ActionTypes.REMOVE_PROJECT_ASSIGNEE: {
      const loadingById = { ...state.assignmentsByProjectId, [action.projectId]: false }
      // eslint-disable-next-line no-unused-vars, no-undef
      const { [action.userId]: ___, ...restProjectAssignees } = state.assignmentsByProjectId[action.projectId]
      const assignmentsByProjectId = { ...state.assignmentsByProjectId, [action.projectId]: restProjectAssignees }
      return {
        ...state,
        assignmentsByProjectId,
        loading: {
          ...state.loading,
          assignmentsByProjectId: loadingById
        }
      }
    }
    default:
      return { ...state }
  }
}
