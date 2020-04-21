import documentSocket from '../sockets/SocketProvider'
import { UserSync } from './index'

export const emitJoinDocumentRoom = (documentId) => {
  return async (dispatch) => {
    if (!documentSocket.connected) {
      return UserSync.socketError()
    }
    dispatch(UserSync.emitJoinDocumentRoom(documentId))
    documentSocket.emit('joinRoom', documentId)
    dispatch(UserSync.documentRoomJoined(documentId))
  }
}

export const emitLeaveDocumentRoom = (dispatch, documentId) => {
  return async (dispatch) => {
    if (!documentSocket.connected) {
      return dispatch(UserSync.socketError())
    }
    dispatch(UserSync.emitLeaveDocumentRoom(documentId))
    documentSocket.emit('leaveRoom', documentId)
    dispatch(UserSync.documentRoomLeft(documentId))
  }
}

export const emitFieldFocus = (dispatch, fieldId, documentId) => {
  return async (dispatch) => {
    if (!documentSocket.connected) {
      return dispatch(UserSync.socketError())
    }
    dispatch(UserSync.emitFieldFocus(fieldId))
    dispatch(updateMyFieldFocus(fieldId))

    documentSocket.emit('fieldFocus', fieldId, documentId)
    dispatch(UserSync.fieldFocusEmitted(fieldId))
  }
}

export const emitFieldBlur = (dispatch, fieldId, documentId) => {
  return async (dispatch) => {
    if (!documentSocket.connected) {
      return dispatch(UserSync.socketError())
    }
    dispatch(UserSync.emitFieldBlur(fieldId))
    dispatch(updateMyFieldFocus(null))
    documentSocket.emit('fieldFocus', null, documentId)
    dispatch(UserSync.fieldBlurEmitted(fieldId))
  }
}

export const emitFieldChange = (dispatch, fieldId, documentId) => {
  return async (dispatch) => {
    if (!documentSocket.connected) {
      return dispatch(UserSync.socketError())
    }
    dispatch(UserSync.emitFieldChange(fieldId))
    documentSocket.emit('fieldChange', fieldId, documentId)
    dispatch(UserSync.fieldChangeEmitted(fieldId))
  }
}

export const updateDocumentRoomUsers = (documentId, userIds) => {
  return UserSync.documentRoomUsersReceived(documentId, userIds)
}

export const updateRemoteUserFieldFocus = (userId, fieldId) => {
  return UserSync.remoteUserFieldFocusUpdated(userId, fieldId)
}

export const updateMyFieldFocus = (fieldId) => {
  return UserSync.myFieldFocusUpdated(fieldId)
}

export const receiveRemoteFieldChange = (userId, fieldId) => {
  return UserSync.remoteFieldChangeEventReceived(userId, fieldId)
}
