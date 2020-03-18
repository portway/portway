import React, { createContext, useReducer } from 'react'
import PropTypes from 'prop-types'
import openSocket from 'socket.io-client'
import { getCookieValue } from '../utilities/cookieParser'

const token = getCookieValue('token')
// sync url is defined by the index.ejs template
// eslint-disable-next-line no-undef
const documentUrl = new URL(`/documents?token=${token}`, SYNC_URL)

const documentSocket = openSocket(documentUrl.href)

const actionTypes = {
  'DOCUMENT_ROOM_USERS_RECEIVED': 'DOCUMENT_ROOM_USERS_RECEIVED',
  'SET_CURRENT_DOCUMENT_ROOM': 'SET_CURRENT_DOCUMENT_ROOM',
  'EMIT_JOIN_DOCUMENT_ROOM': 'EMIT_JOIN_DOCUMENT_ROOM',
  'EMIT_LEAVE_DOCUMENT_ROOM': 'EMIT_LEAVE_DOCUMENT_ROOM',
  'EMIT_FIELD_FOCUS': 'EMIT_FIELD_FOCUS',
  'EMIT_FIELD_BLUR': 'EMIT_FIELD_BLUR',
  'EMIT_FIELD_CHANGE': 'EMIT_FIELD_CHANGE',
  'SOCKET_ERROR': 'SOCKET_ERROR',
  'DOCUMENT_ROOM_JOINED': 'DOCUMENT_ROOM_JOINED',
  'DOCUMENT_ROOM_LEFT': 'DOCUMENT_ROOM_LEFT',
  'FIELD_FOCUS_EMITTED': 'FIELD_FOCUS_EMITTED',
  'FIELD_BLUR_EMITTED': 'FIELD_BLUR_EMITTED',
  'FIELD_CHANGE_EMITTED': 'FIELD_CHANGE_EMITTED',
  'MY_FIELD_FOCUS_UPDATED': 'MY_FIELD_FOCUS_UPDATED',
  'REMOTE_USER_FIELD_FOCUS_UPDATED': 'USER_FIELD_FOCUS_UPDATED',
  'REMOTE_FIELD_CHANGE_EVENT_RECEIVED': 'REMOTE_FIELD_CHANGE_EVENT_RECEIVED'
}

// ACTIONS

export const emitJoinDocumentRoom = (dispatch, documentId) => {
  if (!documentSocket.connected) {
    return { type: actionTypes.SOCKET_ERROR }
  }
  dispatch({ type: actionTypes.EMIT_JOIN_DOCUMENT_ROOM, documentId })
  documentSocket.emit('joinRoom', documentId)
  return {
    type: actionTypes.DOCUMENT_ROOM_JOINED,
    documentId
  }
}

export const emitLeaveDocumentRoom = (dispatch, documentId) => {
  if (!documentSocket.connected) {
    return { type: actionTypes.SOCKET_ERROR }
  }
  dispatch({ type: actionTypes.EMIT_LEAVE_DOCUMENT_ROOM, documentId })
  documentSocket.emit('leaveRoom', documentId)
  return { type: actionTypes.DOCUMENT_ROOM_LEFT, documentId }
}

export const emitFieldFocus = (dispatch, fieldId, documentId) => {
  if (!documentSocket.connected) {
    return { type: actionTypes.SOCKET_ERROR }
  }
  dispatch({ type: actionTypes.EMIT_FIELD_FOCUS, fieldId })
  dispatch(updateMyFieldFocus(fieldId))

  documentSocket.emit('fieldFocus', fieldId, documentId)
  return {
    type: actionTypes.FIELD_FOCUS_EMITTED
  }
}

export const emitFieldBlur = (dispatch, fieldId, documentId) => {
  if (!documentSocket.connected) {
    return { type: actionTypes.SOCKET_ERROR }
  }
  dispatch({ type: actionTypes.EMIT_FIELD_BLUR, fieldId })
  dispatch(updateMyFieldFocus(null))
  documentSocket.emit('fieldFocus', null, documentId)
  return {
    type: actionTypes.FIELD_BLUR_EMITTED
  }
}

export const emitFieldChange = (dispatch, fieldId, documentId) => {
  if (!documentSocket.connected) {
    return { type: actionTypes.SOCKET_ERROR }
  }
  dispatch({ type: actionTypes.EMIT_FIELD_CHANGE, fieldId })
  documentSocket.emit('fieldChange', fieldId, documentId)
  return {
    type: actionTypes.FIELD_CHANGE_EMITTED
  }
}

export const updateDocumentRoomUsers = (documentId, userIds) => {
  return {
    type: actionTypes.DOCUMENT_ROOM_USERS_RECEIVED,
    documentId,
    userIds
  }
}

export const updateRemoteUserFieldFocus = (userId, fieldId) => {
  return {
    type: actionTypes.REMOTE_USER_FIELD_FOCUS_UPDATED,
    userId,
    fieldId
  }
}

export const updateMyFieldFocus = (fieldId) => {
  return {
    type: actionTypes.MY_FIELD_FOCUS_UPDATED,
    fieldId
  }
}

export const receiveRemoteFieldChange = (userId, fieldId) => {
  return {
    type: actionTypes.REMOTE_FIELD_CHANGE_EVENT_RECEIVED,
    userId,
    fieldId
  }
}

// REDUCERS

const initialState = {
  activeDocumentUsers: {},
  currentDocumentRoom: null,
  myFocusedFieldId: null,
  // focus is stored as { userId : fieldId }
  remoteUserFieldFocus: {},
  remoteChangesInCurrentlyFocusedField: []
}

const socketStore = createContext(initialState)
const { Provider } = socketStore

const SocketProvider = ( { children } ) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case actionTypes.DOCUMENT_ROOM_USERS_RECEIVED: {
        const { documentId, userIds } = action
        const newState = {
          ...state,
          activeDocumentUsers: { ...state.activeDocumentUsers, [documentId]: userIds }
        }
        return newState
      }
      case actionTypes.DOCUMENT_ROOM_JOINED: {
        const { documentId } = action
        const newState = { ...state, currentDocumentRoom: documentId }
        return newState
      }
      case actionTypes.DOCUMENT_ROOM_LEFT: {
        const { documentId } = action
        if (state.currentDocumentRoom === documentId) {
          const newState = { ...state, currentDocumentRoom: null }
          return newState
        }
        return state
      }
      case actionTypes.MY_FIELD_FOCUS_UPDATED: {
        const { fieldId } = action
        // change my field focus, also wipe out remote changes array to start fresh
        return { ...state, myFocusedFieldId: fieldId, remoteChangesInCurrentlyFocusedField: [] }
      }
      case actionTypes.REMOTE_USER_FIELD_FOCUS_UPDATED: {
        const { userId, fieldId } = action
        // only update the focus state if user is connected to a document room
        if (state.currentDocumentRoom) {
          const newState = {
            ...state,
            remoteUserFieldFocus: {
              ...state.remoteUserFieldFocus,
              [userId]: fieldId
            }
          }
          return newState
        }
        return state
      }
      case actionTypes.REMOTE_FIELD_CHANGE_EVENT_RECEIVED: {
        const { userId, fieldId } = action
        // for now, we're only logging changes to the currently focused field
        if (fieldId === state.myFocusedFieldId) {
          const remoteChangesInCurrentlyFocusedField = [...state.remoteChangesInCurrentlyFocusedField, { userId, fieldId }]
          return {
            ...state,
            remoteChangesInCurrentlyFocusedField
          }
        }
        return state
      }
      case actionTypes.EMIT_JOIN_DOCUMENT_ROOM:
      case actionTypes.EMIT_LEAVE_DOCUMENT_ROOM:
      case actionTypes.EMIT_FIELD_FOCUS:
      case actionTypes.FIELD_FOCUS_EMITTED:
      case actionTypes.EMIT_FIELD_BLUR:
      case actionTypes.FIELD_BLUR_EMITTED:
      case actionTypes.EMIT_FIELD_CHANGE:
      case actionTypes.FIELD_CHANGE_EMITTED:
        return state
      case actionTypes.SOCKET_ERROR:
        // no need to log, that was done when module loaded, move on silently
        return state
      default:
        throw new Error(`Invalid action type: ${action.type}`)
    }
  }, initialState)

  return <Provider value={{ state, dispatch, documentSocket }}>{children}</Provider>
}

SocketProvider.propTypes = {
  children: PropTypes.node
}

export { socketStore, SocketProvider }
