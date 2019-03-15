import { renderBundles } from '../libs/express-utilities'

const BillingController = function(router) {
  router.get('/', (req, res) => {
    res.render('billing', renderBundles(req, 'Billing', 'billing'))
  })
}

export default BillingController
