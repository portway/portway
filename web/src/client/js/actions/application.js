import { Application } from './index'

export const updateNetworkStatus = (status) => {
  return async (dispatch) => {
    dispatch(Application.updateNetworkStatus(status))
  }
}
