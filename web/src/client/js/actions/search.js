import { NOTIFICATION_RESOURCE, NOTIFICATION_TYPES } from 'Shared/constants'
import { Documents, Notifications, Search } from './index'
import { fetch, globalErrorCodes } from '../api'

export const searchDocuments = (projectId, searchValue) => {
  return async (dispatch) => {
    dispatch(Documents.initiateSearch(searchValue))
    const { data, status } = await fetch(`v1/projects/${projectId}/documents?search=${searchValue}&draft=true`)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.DOCUMENTS, status))
      return
    }
    dispatch(Documents.receiveSearchResults(data))
  }
}

export const clearSearch = () => {
  return async (dispatch) => {
    dispatch(Search.clearSearch())
  }
}
