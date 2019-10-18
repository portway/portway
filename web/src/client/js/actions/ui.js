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

// Billing
export const uiToggleStripeForm = (value) => {
  return async (dispatch) => {
    dispatch(UI.toggleStripeForm(value))
  }
}

/**
 * Confirmation system
 */
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
