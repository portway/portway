import { UI } from './index'

/**
 * Document and Field system
 */
export const uiDocumentCreate = (value) => {
  return async (dispatch) => {
    dispatch(UI.documentCreate(value))
  }
}
export const uiToggleFullScreen = (value) => {
  return async (dispatch) => {
    dispatch(UI.toggleFullScreen(value))
  }
}
export const uiToggleFieldSettings = (fieldId) => {
  return async (dispatch) => {
    dispatch(UI.toggleFieldSettings(fieldId))
  }
}

// Projects
export const uiCreateTokenMode = (value) => {
  return async (dispatch) => {
    dispatch(UI.createTokenMode(value))
  }
}

// Users
export const uiCreateUserMode = (value) => {
  return async (dispatch) => {
    dispatch(UI.createUserMode(value))
  }
}

/**
 * Confirmation system
 */
export const uiConfirm = ({ message, options }) => {
  // Options: cancelAction, confirmedAction, confirmedLabel, confirmedText, theme
  return async (dispatch) => {
    dispatch(UI.initiateConfirm(message, options))
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
