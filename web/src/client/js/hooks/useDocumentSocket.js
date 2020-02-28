import { useContext } from 'react'
import { socketStore } from '../sockets/SocketProvider'

function useDocumentSocket() {
  return useContext(socketStore)
}

export default useDocumentSocket
