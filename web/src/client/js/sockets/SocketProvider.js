import React, { createContext, useReducer } from 'react'
import PropTypes from 'prop-types'
import openSocket from 'socket.io-client'
import { currentUserId } from 'Libs/currentIds'
const documentSocket = openSocket(`http://localhost:3002/documents?userId=${currentUserId}`)

const actionTypes = {
  'DOCUMENT_ROOM_USERS_RECEIVED': 'DOCUMENT_ROOM_USERS_RECEIVED',
  'SET_CURRENT_DOCUMENT_ROOM': 'SET_CURRENT_DOCUMENT_ROOM'
}

export const updateDocumentRoomUsers = (documentId, userIds) => {
  return {
    type: actionTypes.DOCUMENT_ROOM_USERS_RECEIVED,
    documentId,
    userIds
  }
}

export const setCurrentDocumentRoom = (documentId) => {
  return {
    type: actionTypes.SET_CURRENT_DOCUMENT_ROOM,
    documentId
  }
}

const initialState = {
  activeDocumentUsers: {},
  currentDocumentRoom: null
}

const socketStore = createContext(initialState)
const { Provider } = socketStore

const SocketProvider = ( { children } ) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case actionTypes.DOCUMENT_ROOM_USERS_RECEIVED: {
        const { documentId, userIds } = action
        const newState = { ...state, activeDocumentUsers: { ...state.activeDocumentUsers, [documentId]: userIds } }
        return newState
      }
      case actionTypes.SET_CURRENT_DOCUMENT_ROOM: {
        const { documentId } = action
        const newState = { ...state, currentDocumentRoom: documentId }
        return newState
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