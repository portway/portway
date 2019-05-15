import { ActionTypes } from '../actions'
import { groupBy } from 'Shared/utilities'

const initialState = {
  project: {},
  document: {}
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
      console.log(action)
      const resource = action.resource
      const errorsByField = groupBy(action.data.errorDetails, 'key')
      return {
        ...state,
        [resource]: errorsByField
      }
    }
    // Clear on initiating new API requests
    // Project
    case ActionTypes.CREATE_PROJECT:
    case ActionTypes.INITIATE_PROJECT_UPDATE:
    case ActionTypes.INITIATE_PROJECT_REMOVE:
    case ActionTypes.CREATE_PROJECT_ASSIGNEE:
    case ActionTypes.INITIATE_PROJECT_ASSIGNEE_UPDATE:
    case ActionTypes.INITIATE_PROJECT_ASSIGNEE_REMOVE:
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
