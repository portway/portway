import ono from 'ono'

export default function(req, res, next) {
  const error = new ono({ code: 404 })
  next(error)
}