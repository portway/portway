import { ActionTypes } from '../actions'

const initialState = {
  documents: {
    creating: false
  }
}

export const ui = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.UI_DOCUMENT_CREATE:
      return { ...state, documents: { ...state.documents, creating: action.value } }
    default:
      return { ...state }
  }
}
