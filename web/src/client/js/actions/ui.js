import { UI } from './index'

export const uiDocumentCreate = (value) => {
  return async (dispatch) => {
    dispatch(UI.documentCreate(value))
  }
}

export const uiConfirm = ({ message, cancelAction, confirmedAction, confirmedLabel }) => {
  return async (dispatch) => {
    dispatch(UI.initiateConfirm(message, cancelAction, confirmedAction, confirmedLabel))
  }
}

export const uiConfirmCancel = () => {
  return async (dispatch) => {
    dispatch(UI.cancelConfirm())
  }
}

export const uiConfirmComplete = () => {
  return async (dispatch) => {
    dispatch(UI.completeConfirm())
  }
}
