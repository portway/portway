import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import useDocumentSocket from 'Hooks/useDocumentSocket'
import {
  updateDocumentRoomUsers,
  emitJoinDocumentRoom,
  emitLeaveDocumentRoom
} from '../../sockets/SocketProvider'

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

  console.log(activeUsers)

  return <div />
}

DocumentUsersContainer.propTypes = {
}

export default DocumentUsersContainer
