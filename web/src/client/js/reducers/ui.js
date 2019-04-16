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
  }
}

export const ui = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.UI_DOCUMENT_CREATE: {
      return { ...state, documents: { ...state.documents, creating: action.value } }
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
