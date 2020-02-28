import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import useDocumentSocket from 'Hooks/useDocumentSocket'
import {
  updateDocumentRoomUsers,
  emitJoinDocumentRoom,
  emitLeaveDocumentRoom
} from '../../sockets/SocketProvider'
import DocumentUsersComponent from './DocumentUsersComponent'

const DocumentUsersContainer = () => {
  const { documentId } = useParams()
  const { state: socketState, dispatch: socketDispatch, documentSocket } = useDocumentSocket()

  const activeUsers = socketState.activeDocumentUsers[documentId]
  const currentDocumentRoom = socketState.currentDocumentRoom

  useEffect(() => {
    socketDispatch(emitJoinDocumentRoom(socketDispatch, documentId))
    documentSocket.on('userChange', (userIds) => {
      socketDispatch(updateDocumentRoomUsers(documentId, userIds))
    })
    return () => {
      if (currentDocumentRoom) {
        socketDispatch(emitLeaveDocumentRoom(socketDispatch, currentDocumentRoom))
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId])

  return <DocumentUsersComponent activeUsers={activeUsers} />
}

DocumentUsersContainer.propTypes = {
}

export default DocumentUsersContainer
