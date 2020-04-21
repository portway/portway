import { useEffect, useRef } from 'react'
import useDocumentSocket from './useDocumentSocket'
import { currentUserId } from 'Libs/currentIds'
import documentSocket from '../sockets/SocketProvider'
import Store from '../reducers'

export default function(documentId, cb) {
  const { documentSocket, dispatch: socketDispatch } = useDocumentSocket()
  const documentIdRef = useRef()
  documentIdRef.current = documentId

  useEffect(() => {
    const handleUserFieldChange = (userId, fieldId) => {
      socketDispatch(receiveRemoteFieldChange(userId, fieldId))
      if (userId !== currentUserId.toString()) {
        cb(documentIdRef.current)
      }
    }

    documentSocket.on('userFieldChange', handleUserFieldChange)
    return () => {
      documentSocket.off('userFieldChange', handleUserFieldChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}