import { useEffect } from 'react'
import useDocumentSocket from './useDocumentSocket'
import { emitJoinDocumentRoom, emitLeaveDocumentRoom, updateDocumentRoomUsers } from '../sockets/SocketProvider'

export default function(documentId) {
  const { documentSocket, dispatch: socketDispatch } = useDocumentSocket()

  useEffect(() => {
    socketDispatch(emitJoinDocumentRoom(socketDispatch, documentId))

    const handleUserChange = (userIds) => {
      socketDispatch(updateDocumentRoomUsers(documentId, userIds))
    }

    documentSocket.on('userChange', handleUserChange)

    return () => {
      socketDispatch(emitLeaveDocumentRoom(socketDispatch))
      documentSocket.off('userChange', handleUserChange)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId])
}
