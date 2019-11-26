import cuid from 'cuid'

// Generate a unique id when loaded
export const processId = cuid()

export const generateId = () => {
  return cuid()
}