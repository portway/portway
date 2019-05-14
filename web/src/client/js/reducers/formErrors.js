import { ActionTypes } from '../actions'
import { groupBy } from 'Shared/utilities'

const initialState = {
  project: {},
  document: {}
}

export const formErrors = (state = initialState, action) => {
  switch (action.type) {
    // Clear formErrors on any route change
    case ActionTypes.ROUTE_CHANGE: {
      return initialState
    }
    // Group errors by errorDetail key, so that we can display multiple
    // messages per field in a form
    case ActionTypes.CREATE_FORM_ERRORS: {
      const resource = action.resource
      const errorsByField = groupBy(action.data.errorDetails, 'key')
      return {
        ...state,
        [resource]: errorsByField
      }
    }
    default: {
      return state
    }
  }
}
