import { uniqueId } from 'lodash'
import { ActionTypes } from '../actions'

const initialState = {
  notifications: {}
}

export const notifications = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.CREATE_NOTIFICATION: {
      const { noticeType, resource, code, message } = action
      const noticeId = uniqueId(Date.now())
      const notice = {
        type: noticeType,
        resource: resource,
        code: code,
        message: message
      }
      return {
        ...state,
        notifications: {
          ...state.notifications,
          [noticeId]: notice
        }
      }
    }
    case ActionTypes.DISMISS_NOTIFICATION: {
      const { noticeId } = action
      // eslint-disable-next-line no-unused-vars
      const { [noticeId]: ___, ...restNotifications } = state.notifications
      return {
        ...state,
        notifications: restNotifications
      }
    }
    default:
      return state
  }
}
