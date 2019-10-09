const AppController = function(router) {
  // Sending all requests to dashboard view, for Redux Router
  router.get('*', (req, res, next) => {
    res.render('./public/index.html')
  })
}

export default AppController
