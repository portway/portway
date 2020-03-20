import { useEffect } from 'react'
import useDocumentSocket from './useDocumentSocket'
import { updateRemoteUserFieldFocus, receiveRemoteFieldChange } from '../sockets/SocketProvider'
import { currentUserId } from 'Libs/currentIds'
import { fetchDocument } from 'Actions/document'

export default function(documentId) {
  const { documentSocket, dispatch: socketDispatch } = useDocumentSocket()

  return useEffect(() => {
    if (documentId) {
      documentSocket.on('userFocusChange', (userId, fieldId) => {
        socketDispatch(updateRemoteUserFieldFocus(userId, fieldId))
      })
      documentSocket.on('userFieldChange', (userId, fieldId) => {
        socketDispatch(receiveRemoteFieldChange(userId, fieldId))
        if (userId !== currentUserId.toString()) {
          fetchDocument(documentId)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId])
}