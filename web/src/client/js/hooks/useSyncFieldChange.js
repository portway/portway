import { useEffect, useRef } from 'react'
import useDocumentSocket from './useDocumentSocket'
import { receiveRemoteFieldChange } from '../sockets/SocketProvider'
import { currentUserId } from 'Libs/currentIds'

export default function(documentId, cb) {
  const { documentSocket, dispatch: socketDispatch } = useDocumentSocket()
  const documentIdRef = useRef()
  documentIdRef.current = documentId

  const handleUserFieldChange = (userId, fieldId) => {
    socketDispatch(receiveRemoteFieldChange(userId, fieldId))
    if (userId !== currentUserId.toString()) {
      cb(documentIdRef.current)
    }
  }

  useEffect(() => {
    documentSocket.on('userFieldChange', handleUserFieldChange)
    return () => {
      documentSocket.off('userFieldChange', handleUserFieldChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}