import { Notifications } from './index'

export const createNotification = (message, noticeType, resource, code) => {
  return async (dispatch) => {
    dispatch(Notifications.create(message, noticeType, resource, code))
  }
}

export const dismissNotification = (notificationId) => {
  return async (dispatch) => {
    dispatch(Notifications.dismiss(notificationId))
  }
}
