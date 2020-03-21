import { useEffect } from 'react'
import useDocumentSocket from './useDocumentSocket'
import { updateRemoteUserFieldFocus } from '../sockets/SocketProvider'

export default function(documentId) {
  const { documentSocket, dispatch: socketDispatch } = useDocumentSocket()

  return useEffect(() => {
    const handleUserFocus = (userId, fieldId) => {
      socketDispatch(updateRemoteUserFieldFocus(userId, fieldId))
    }

    documentSocket.on('userFocusChange', handleUserFocus)

    return () => {
      documentSocket.off('userFocusChange', handleUserFocus)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}