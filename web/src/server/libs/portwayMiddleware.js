// Super awesome middleware that gives us a storage namespace
// on requests
export default (req, res, next) => {
  req._portway = {}
  next()
}