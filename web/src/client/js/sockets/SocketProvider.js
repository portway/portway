import React, { createContext, useReducer } from 'react'
import PropTypes from 'prop-types'
import openSocket from 'socket.io-client'
import { getCookieValue } from '../utilities/cookieParser'
import { currentUserId } from 'Libs/currentIds'

const token = getCookieValue('token')
// TODO: pass in via env
const documentUrl = new URL(`/documents?token=${token}&userId=${currentUserId}`, window.SYNC_URL)

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
  'USER_FIELD_FOCUS_UPDATED': 'USER_FIELD_FOCUS_UPDATED',
  'FIELD_CHANGE_EVENT_RECEIVED': 'FIELD_CHANGE_EVENT_RECEIVED'
}

// ACTIONS

export const updateDocumentRoomUsers = (documentId, userIds) => {
  return {
    type: actionTypes.DOCUMENT_ROOM_USERS_RECEIVED,
    documentId,
    userIds
  }
}

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

export const emitFieldFocus = (dispatch, fieldId) => {
  if (!documentSocket.connected) {
    return { type: actionTypes.SOCKET_ERROR }
  }
  dispatch({ type: actionTypes.EMIT_FIELD_FOCUS, fieldId })
  documentSocket.emit('fieldFocus', fieldId)
  return {
    type: actionTypes.FIELD_FOCUS_EMITTED
  }
}

export const emitFieldBlur = (dispatch, fieldId) => {
  if (!documentSocket.connected) {
    return { type: actionTypes.SOCKET_ERROR }
  }
  dispatch({ type: actionTypes.EMIT_FIELD_BLUR, fieldId })
  documentSocket.emit('fieldFocus', null)
  return {
    type: actionTypes.FIELD_BLUR_EMITTED
  }
}

export const updateUserFieldFocus = (userId, fieldId) => {
  return {
    type: actionTypes.USER_FIELD_FOCUS_UPDATED,
    userId,
    fieldId
  }
}

export const emitFieldChange = (dispatch, fieldId) => {
  if (!documentSocket.connected) {
    return { type: actionTypes.SOCKET_ERROR }
  }
  dispatch({ type: actionTypes.EMIT_FIELD_CHANGE, fieldId })
  documentSocket.emit('fieldChange', fieldId)
  return {
    type: actionTypes.FIELD_BLUR_EMITTED
  }
}

// REDUCERS

const initialState = {
  activeDocumentUsers: {},
  currentDocumentRoom: null,
  // focus is stored as { userId : fieldId }
  currentDocumentUserFieldFocus: {}
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
      case actionTypes.USER_FIELD_FOCUS_UPDATED: {
        const { userId, fieldId } = action
        // only update the focus state if user is connected to a document room
        if (state.currentDocumentRoom) {
          const newState = {
            ...state,
            currentDocumentUserFieldFocus: {
              ...state.currentDocumentUserFieldFocus,
              [userId]: fieldId
            }
          }
          return newState
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
      default:
        throw new Error()
    }
  }, initialState)

  return <Provider value={{ state, dispatch, documentSocket }}>{children}</Provider>
}

SocketProvider.propTypes = {
  children: PropTypes.function
}

export { socketStore, SocketProvider }