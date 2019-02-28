import { renderBundles } from '../libs/express-utilities'

const HomeController = function(router) {
  /* GET home page. */
  router.get('/', (req, res) => {
    res.render('index', renderBundles(req, 'Home', 'index'))
  })
}

export default HomeController