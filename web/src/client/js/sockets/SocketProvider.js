import React, { createContext, useReducer } from 'react'
import PropTypes from 'prop-types'
import openSocket from 'socket.io-client'
import { currentUserId } from 'Libs/currentIds'
// TODO: pass in via env
const documentSocket = openSocket(`http://localhost:3002/documents?userId=${currentUserId}`)

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
  'DOCUMENT_ROOM_LEFT': 'DOCUMENT_ROOM_LEFT'
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

export const emitFieldFocus = (dispatch, documentId, fieldId) => {
  if (!documentSocket.connected) {
    return { type: actionTypes.SOCKET_ERROR }
  }
  dispatch({ type: actionTypes.EMIT_FIELD_FOCUS, documentId })
  return {
    type: actionTypes.FIELD_FOCUS_EMITTED
  }
}

// REDUCERS

const initialState = {
  activeDocumentUsers: {},
  currentDocumentRoom: null
}

const socketStore = createContext(initialState)
const { Provider } = socketStore

const SocketProvider = ( { children } ) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case actionTypes.EMIT_JOIN_DOCUMENT_ROOM:
      case actionTypes.EMIT_LEAVE_DOCUMENT_ROOM:
      case actionTypes.DOCUMENT_ROOM_USERS_RECEIVED: {
        const { documentId, userIds } = action
        const newState = { ...state, activeDocumentUsers: { ...state.activeDocumentUsers, [documentId]: userIds } }
        return newState
      }
      case actionTypes.DOCUMENT_ROOM_JOINED: {
        const { documentId } = action
        const newState = { ...state, currentDocumentRoom: documentId }
        return newState
      }
      case actionTypes.DOCUMENT_ROOM_LEFT: {
        const { documentId } = action
        if (state.currentDocumentRoom === documentId ) {
          const newState = { ...state, currentDocumentRoom: null }
          return newState
        }
        return state
      }
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