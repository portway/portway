import { Form } from './index'

export const formSubmitAction = (name) => {
  return async (dispatch) => {
    dispatch(Form.submitted(name))
  }
}

export const formSucceededAction = (name) => {
  return async (dispatch) => {
    dispatch(Form.succeeded(name))
    setTimeout(() => {
      dispatch(Form.reset(name))
    }, 2000)
  }
}

export const formResetAction = (name) => {
  return async (dispatch) => {
    dispatch(Form.reset(name))
  }
}

export const formFailedAction = (name) => {
  return async (dispatch) => {
    dispatch(Form.failed(name))
  }
}
