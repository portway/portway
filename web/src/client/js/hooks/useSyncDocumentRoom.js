import { useEffect } from 'react'
import useDocumentSocket from './useDocumentSocket'
import { emitJoinDocumentRoom, emitLeaveDocumentRoom, updateDocumentRoomUsers } from '../sockets/SocketProvider'

export default function(documentId) {
  const { documentSocket, dispatch: socketDispatch } = useDocumentSocket()

  // only want to run the event attachment function here once
  useEffect(() => {
    const handleUserChange = (userIds) => {
      socketDispatch(updateDocumentRoomUsers(documentId, userIds))
    }

    documentSocket.on('userChange', handleUserChange)
    return () => {
      documentSocket.off('userChange', handleUserChange)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  useEffect(() => {
    if (documentId) {
      socketDispatch(emitJoinDocumentRoom(socketDispatch, documentId))
    }

    return () => {
      socketDispatch(emitLeaveDocumentRoom(socketDispatch))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId])
}
