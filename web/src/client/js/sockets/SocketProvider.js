import React, { createContext, useReducer } from 'react'
import PropTypes from 'prop-types'
import openSocket from 'socket.io-client'
const documentSocket = openSocket('http://localhost:3002/documents')

const actionTypes = {
  'DOCUMENT_ROOM_USERS_RECEIVED': 'DOCUMENT_ROOM_USERS_RECEIVED'
}

export const updateDocumentRoomUsers = (documentId, userIds) => {
  return {
    type: actionTypes.DOCUMENT_ROOM_USERS_RECEIVED,
    documentId,
    userIds
  }
}

const initialState = {
  activeDocumentUsers: {},
}

const socketStore = createContext(initialState)
const { Provider } = socketStore

const SocketProvider = ( { children } ) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case actionTypes.DOCUMENT_ROOM_USERS_RECEIVED:
        const { documentId, userIds } = action
        const newState = { ...state, activeDocumentUsers: { ...state.activeDocumentUsers, [documentId]: userIds } }
        return newState
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