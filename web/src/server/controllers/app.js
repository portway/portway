import { renderBundles } from '../libs/express-utilities'

const AppController = function(router) {
  // Sending all requests to dashboard view, for Redux Router
  router.get('*', (req, res, next) => {
    res.render('app/index', renderBundles(req, 'Welcome', 'app'))
  })
}

export default AppController
