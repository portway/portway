import { organizationSocket } from '../sockets/SocketProvider'
import { OrganizationSync } from './index'

export const emitDocumentCreated = (projectId) => {
  return async (dispatch) => {
    if (!organizationSocket.connected) {
      return OrganizationSync.socketError()
    }
    organizationSocket.emit('documentCreated', projectId)
    dispatch(OrganizationSync.documentCreatedEventEmitted(projectId))
  }
}

export const receiveDocumentCreatedEvent = (projectId) => {
  return async (dispatch) => {
    dispatch(OrganizationSync.documentCreatedEventReceived(projectId))
  }
}
