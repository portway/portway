import { renderBundles } from '../libs/express-utilities'

const AppController = function(router) {
  // Sending all requests to dashboard view, for Redux Router
  router.get('*', (req, res) => {
    const bundleTemplateVars = renderBundles(req, 'Welcome', 'app')
    res.render('app/index',
      {
        ...bundleTemplateVars,
        apiPublicUrl: process.env.API_PUBLIC_URL,
        stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY
      }
    )
  })
}

export default AppController
