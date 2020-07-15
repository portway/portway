import { ActionTypes } from '../actions'

const initialState = {
  modalType: null,
  modalProps: {},
}

export const modal = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.MODAL_SHOW:
      return {
        modalType: action.modalType,
        modalProps: action.modalProps,
      }
    case ActionTypes.MODAL_HIDE:
      return initialState
    default:
      return state
  }
}
