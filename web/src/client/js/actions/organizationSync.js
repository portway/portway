import organizationSocket from '../sockets/SocketProvider'
import { OrganizationSync } from './index'

export const emitDocumentCreated = (projectId) => {
  return async (dispatch) => {
    if (!organizationSocket.connected) {
      return OrganizationSync.socketError()
    }
    organizationSocket.emit('documentCreated', documentId)
    dispatch(OrganizationSync.documentCreatedEventEmitted(projectId))
  }
}

export const receiveDocumentCreatedEvent = (projectId) => {
  return async (dispatch, getState) => {
    dispatch(OrganizationSync.documentCreatedEventReceived(projectId))
  }
}
