import ono from 'ono'

export default function(req, res, next) {
  const authorized = req.body.adminKey === process.env.ADMIN_SECRET_KEY
  if (authorized) {
    next()
  } else {
    const error = ono({ code: 401 }, 'Unauthorized')
    next(error)
  }
}