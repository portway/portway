import { useEffect } from 'react'
import useDocumentSocket from './useDocumentSocket'
import { receiveRemoteFieldChange } from '../sockets/SocketProvider'
import { currentUserId } from 'Libs/currentIds'
import { fetchDocument } from 'Actions/document'
import Store from '../reducers/'

export default function(documentId, cb) {
  const { documentSocket, dispatch: socketDispatch } = useDocumentSocket()

  const handleUserFieldChange = () => {
    documentSocket.on('userFieldChange', (userId, fieldId) => {
      socketDispatch(receiveRemoteFieldChange(userId, fieldId))
      if (userId !== currentUserId.toString()) {
        Store.dispatch(fetchDocument(documentId))
      }
      cb()
    })
  }

  useEffect(() => {
    documentSocket.on('userFieldChange', handleUserFieldChange)
    return () => {
      documentSocket.off('userFieldChange', handleUserFieldChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}