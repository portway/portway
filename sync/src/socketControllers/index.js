import documents from './documents'
import organization from './organization'

export default (io) => {
  documents(io)
  organization(io)
}
