import { ActionTypes } from '../actions'

const initialState = {
  byName: {}
}

export const forms = (state = initialState, action) => {
  switch (action.type) {
    // Clear validation on any route change
    case ActionTypes.ROUTE_CHANGE: {
      return initialState
    }
    // If a form submits, set its value to true
    case ActionTypes.FORM_SUBMITTED: {
      const { name } = action
      const formObject = { submitted: true, succeeded: false, failed: false }
      const byName = { ...state.byName, [name]: formObject }
      return { ...state, byName }
    }
    // If a form succeeds, set its value to true
    case ActionTypes.FORM_SUCCEEDED: {
      const { name } = action
      const formObject = { submitted: true, succeeded: true, failed: false }
      const byName = { ...state.byName, [name]: formObject }
      return { ...state, byName }
    }
    // If a form fails, set its value to true
    case ActionTypes.FORM_FAILED: {
      const { name } = action
      const formObject = { submitted: true, succeeded: false, failed: true }
      const byName = { ...state.byName, [name]: formObject }
      return { ...state, byName }
    }
    // If a form resets, set its values to false
    case ActionTypes.FORM_RESET: {
      const { name } = action
      const formObject = { submitted: false, succeeded: false, failed: false }
      const byName = { ...state.byName, [name]: formObject }
      return { ...state, byName }
    }
    default: {
      return state
    }
  }
}
