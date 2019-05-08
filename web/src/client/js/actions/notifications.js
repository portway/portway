import { Notifications } from './index'

export const dismissNotification = (noticeId) => {
  return async (dispatch) => {
    dispatch(Notifications.dismiss(noticeId))
  }
}
