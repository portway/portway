import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET

export default {
  jwtMiddleware: (socket, next) => {
    const token = socket.handshake.query && socket.handshake.query.token

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        // TODO: log this
        console.error(err)
        return next(err)
      }
      next()
    })
  }
}
