import axios from 'axios'

import { NOTIFICATION_TYPES } from 'Shared/constants'
import { Form, Notifications } from './index'

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

export const standardFormSubmit = (name, body) => {
  return async (dispatch) => {
    formSubmitAction(name)
    console.log(body)
    axios
      .post('/squishymuffins', body)
      .then((response) => {
        dispatch(formSucceededAction(name))
      })
      .catch((error) => {
        dispatch(formFailedAction(name))
        dispatch(Notifications.create('Cannot submit form', NOTIFICATION_TYPES.ERROR, 'form', error.status))
      })
  }
}

