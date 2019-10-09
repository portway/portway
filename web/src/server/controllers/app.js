const devMode = process.env.NODE_ENV !== 'production'

const AppController = function(router) {
  // Sending all requests to dashboard view, for Redux Router
  if (!devMode) {
    router.get('*', (req, res, next) => {
      res.sendFile('app.html', { root: __dirname + '/../' })
    })
  }
}

export default AppController
