import { useEffect } from 'react'
import useDocumentSocket from './useDocumentSocket'

export default function(documentId, cb) {
  const { documentSocket } = useDocumentSocket()

  useEffect(() => {
    if (documentId) {
      documentSocket.on('userFieldChange', cb)
      return () => {
        documentSocket.off('userFieldChange', cb)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId])
}