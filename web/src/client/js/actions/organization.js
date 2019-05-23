import { Organizations, Notifications } from './index'
import { fetch, globalErrorCodes } from '../api'
import { NOTIFICATION_TYPES, NOTIFICATION_RESOURCE } from 'Shared/constants'

export const fetchOrganization = (orgId) => {
  return async (dispatch) => {
    dispatch(Organizations.requestOne(orgId))
    const { data, status } = await fetch(`organizations/${orgId}`)

    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.ORGANIZATION, status))
      return
    }

    dispatch(Organizations.receiveOne(data))
  }
}
