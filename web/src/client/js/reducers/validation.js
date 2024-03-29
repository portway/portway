import { ActionTypes } from '../actions'
import { groupBy } from 'Shared/utilities'

const initialState = {
  document: {},
  field: {},
  organization: {},
  project: {},
  user: {}
}

export const validation = (state = initialState, action) => {
  switch (action.type) {
    // Clear validation on any route change
    case ActionTypes.ROUTE_CHANGE: {
      return initialState
    }
    // Group errors by errorDetail key, so that we can display multiple
    // messages per field in a form
    case ActionTypes.CREATE_VALIDATION_ERRORS: {
      const resource = action.resource
      const errorsByField = groupBy(action.data.errorDetails, 'key')
      return {
        ...state,
        [resource]: errorsByField
      }
    }
    // Clear on initiating new API requests
    // User
    case ActionTypes.INITIATE_USER_UPDATE:
    case ActionTypes.INITIATE_USER_REMOVE: {
      return {
        ...state,
        user: {}
      }
    }
    case ActionTypes.UI_CREATE_USER_MODE: {
      const isExiting = action.value === false
      if (isExiting) {
        return {
          ...state,
          user: {}
        }
      } else {
        return { ...state }
      }
    }
    // Project
    case ActionTypes.CREATE_PROJECT:
    case ActionTypes.INITIATE_PROJECT_UPDATE:
    case ActionTypes.INITIATE_PROJECT_REMOVE:
    case ActionTypes.CREATE_PROJECT_ASSIGNEE:
    case ActionTypes.INITIATE_PROJECT_ASSIGNEE_UPDATE:
    case ActionTypes.INITIATE_PROJECT_ASSIGNEE_REMOVE:
    case ActionTypes.CREATE_PROJECT_TOKEN:
    case ActionTypes.INITIATE_PROJECT_TOKEN_REMOVE:
      return {
        ...state,
        project: {}
      }
    // Document
    case ActionTypes.INITIATE_DOCUMENT_CREATE:
    case ActionTypes.INITIATE_DOCUMENT_UPDATE:
    case ActionTypes.INITIATE_DOCUMENT_REMOVE:
      return {
        ...state,
        document: {}
      }
    default: {
      return state
    }
  }
}
