import { renderBundles } from '../libs/express-utilities'
import { SIGNUP_DISABLED } from '../constants'

const HomeController = function(router) {
  /* GET home page. */
  router.get('/', (req, res) => {
    const options = {
      ...renderBundles(req, 'Home', 'index'),
      disableSignup: SIGNUP_DISABLED
    }
    res.render('index', options)
  })
}

export default HomeController