import { ActionTypes } from '../actions'

const initialState = {
  confirmation: {
    confirming: false,
    message: '',
    cancelAction: null,
    confirmedAction: null,
    confirmedLabel: ''
  },
  documents: {
    creating: false
  },
  fields: {
    creating: false,
    type: -1
  },
  tokens: {
    creating: false
  }
}

export const ui = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.UI_DOCUMENT_CREATE: {
      return { ...state, documents: { ...state.documents, creating: action.value } }
    }
    case ActionTypes.INITIATE_FIELD_CREATE: {
      // Tell everyone we're creating a field, and what type
      return { ...state, fields: { ...state.fields, creating: true, type: action.fieldType } }
    }
    case ActionTypes.RECEIVE_CREATED_FIELD: {
      // Reset fields when a field is created
      return { ...state, fields: initialState.fields }
    }
    case ActionTypes.RECEIVE_CREATED_DOCUMENT: {
      return { ...state, documents: { ...state.documents, creating: false } }
    }
    case ActionTypes.UI_INITIATE_CONFIRMATION: {
      return {
        ...state,
        confirmation: {
          ...state.confirmation,
          confirming: true,
          message: action.message,
          cancelAction: action.cancelAction,
          confirmedAction: action.confirmedAction,
          confirmedLabel: action.confirmedLabel
        }
      }
    }
    case ActionTypes.UI_COMPLETE_CONFIRMATION: {
      const confirmation = initialState.confirmation
      return {
        ...state,
        confirmation
      }
    }
    case ActionTypes.UI_CANCEL_CONFIRMATION: {
      return {
        ...state,
        confirmation: {
          ...state.confirmation,
          confirming: false
        }
      }
    }
    default:
      return { ...state }
  }
}
