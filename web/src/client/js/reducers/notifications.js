import { uniqueId } from 'lodash'
import { ActionTypes } from '../actions'

const initialState = {
  notices: {}
}

export const notifications = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.CREATE_NOTIFICATION: {
      const { noticeType, code, message } = action
      const noticeId = uniqueId(Date.now())
      const notice = {
        type: noticeType,
        code: code,
        message: message
      }
      return {
        ...state,
        notices: {
          ...state.notices,
          [noticeId]: notice
        }
      }
    }
    case ActionTypes.DISMISS_NOTIFICATION: {
      const { noticeId } = action
      // eslint-disable-next-line no-unused-vars
      const { [noticeId]: ___, ...restNotifications } = state.notices
      return {
        ...state,
        notices: restNotifications
      }
    }
    default:
      return state
  }
}
