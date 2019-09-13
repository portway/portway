import { ActionTypes } from '../actions'

const initialState = {
  currentForm: null,
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
      const currentForm = name
      const formObject = { submitted: true, succeeded: false, failed: false }
      const byName = { ...state.byName, [name]: formObject }
      return { ...state, currentForm, byName }
    }
    // If a form succeeds, set its value to true
    case ActionTypes.FORM_SUCCEEDED: {
      const formObject = { submitted: true, succeeded: true, failed: false }
      const byName = { ...state.byName, [state.currentForm]: formObject }
      return { ...state, byName }
    }
    // If a form submits, set its value to true
    case ActionTypes.FORM_FAILED: {
      const formObject = { submitted: true, succeeded: false, failed: true }
      const byName = { ...state.byName, [state.currentForm]: formObject }
      return { ...state, byName }
    }
    // On validation, forms should fail
    case ActionTypes.CREATE_VALIDATION_ERRORS: {
      const formObject = { submitted: true, succeeded: false, failed: true }
      const byName = { ...state.byName, [state.currentForm]: formObject }
      return { ...state, byName }
    }
    default: {
      return state
    }
  }
}
