import crypto from 'crypto'

export default (byteLength, encoding = 'base64') => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(byteLength, (err, buff) => {
      if (err) {
        return reject(err)
      }
      resolve(buff.toString(encoding))
    })
  })
}