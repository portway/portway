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

export const emitLeaveDocumentRoom = (documentId) => {
  return async (dispatch) => {
    if (!documentSocket.connected) {
      return dispatch(UserSync.socketError())
    }
    dispatch(UserSync.emitLeaveDocumentRoom(documentId))
    documentSocket.emit('leaveRoom', documentId)
    dispatch(UserSync.documentRoomLeft(documentId))
  }
}

export const emitFieldFocus = (fieldId, documentId) => {
  console.log('emitting field focus')
  return async (dispatch) => {
    if (!documentSocket.connected) {
      return dispatch(UserSync.socketError())
    }
    dispatch(UserSync.emitFieldFocus(fieldId))
    console.log('here')
    dispatch(updateMyFieldFocus(fieldId))
    console.log('here')
    documentSocket.emit('fieldFocus', fieldId, documentId)
    dispatch(UserSync.fieldFocusEmitted(fieldId))
    console.log('here too')
  }
}

export const emitFieldBlur = (fieldId, documentId) => {
  console.log('emitting fieldf blur')
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

export const emitFieldChange = (fieldId, documentId) => {
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
  return async (dispatch) => {
    dispatch(UserSync.documentRoomUsersReceived(documentId, userIds))
  }
}

export const updateRemoteUserFieldFocus = (userId, fieldId) => {
  return async (dispatch) => {
    dispatch(UserSync.remoteUserFieldFocusUpdated(userId, fieldId))
  }
}

export const updateMyFieldFocus = (fieldId) => {
  return async (dispatch) => {
    dispatch(UserSync.myFieldFocusUpdated(fieldId))
  }
}

export const receiveRemoteFieldChange = (userId, fieldId) => {
  return async (dispatch) => {
    dispatch(UserSync.remoteFieldChangeEventReceived(userId, fieldId))
  }
}
