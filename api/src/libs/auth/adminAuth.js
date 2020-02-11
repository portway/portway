import ono from 'ono'

export default function(req, res, next) {
  let headerToken

  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Admin') {
    headerToken = req.headers.authorization.split(' ')[1]
  }

  const authorized = headerToken === process.env.ADMIN_SECRET_KEY

  if (authorized) {
    next()
  } else {
    const error = ono({ code: 401 }, 'Unauthorized')
    next(error)
  }
}