import { renderBundles } from '../libs/express-utilities'
import { SUPPORT_LINK } from '../../shared/constants'

const AppController = function(router) {
  // Sending all requests to dashboard view, for Redux Router
  router.get('*', (req, res) => {
    const bundleTemplateVars = renderBundles(req, 'Welcome', 'app', { supportLink: SUPPORT_LINK })
    res.render('app/index',
      {
        ...bundleTemplateVars,
        apiPublicUrl: process.env.API_PUBLIC_URL,
        stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        syncUrl: process.env.SYNC_URL
      }
    )
  })
}

export default AppController
