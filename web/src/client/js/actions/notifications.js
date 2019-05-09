import { Notifications } from './index'

export const dismissNotification = (notificationId) => {
  return async (dispatch) => {
    dispatch(Notifications.dismiss(notificationId))
  }
}
