import { ActionTypes } from '../actions'

const initialState = {
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
    default:
      return { ...state }
  }
}
