import { Form } from './index'

export const formSubmitAction = (name) => {
  return async (dispatch) => {
    dispatch(Form.submitted(name))
  }
}

export const formSucceededAction = (name) => {
  return async (dispatch) => {
    dispatch(Form.succeeded(name))
  }
}

export const formFailedAction = (name) => {
  return async (dispatch) => {
    dispatch(Form.failed(name))
  }
}
