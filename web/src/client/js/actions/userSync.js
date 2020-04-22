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
  return async (dispatch) => {
    if (!documentSocket.connected) {
      return dispatch(UserSync.socketError())
    }
    dispatch(UserSync.emitFieldFocus(fieldId))
    documentSocket.emit('fieldFocus', fieldId, documentId)
    dispatch(UserSync.fieldFocusEmitted(fieldId))
  }
}

export const emitFieldBlur = (fieldId, documentId) => {
  return async (dispatch) => {
    if (!documentSocket.connected) {
      return dispatch(UserSync.socketError())
    }
    dispatch(UserSync.emitFieldBlur(fieldId))
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

export const receiveRemoteFieldChange = (userId, fieldId) => {
  return async (dispatch, getState) => {
    const state = getState()
    const focusedFieldId = state.documentFields.focused.id
    dispatch(UserSync.remoteFieldChangeEventReceived(userId, fieldId, focusedFieldId))
  }
}
