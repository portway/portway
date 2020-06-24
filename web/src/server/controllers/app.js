import { renderBundles } from '../libs/express-utilities'
import {
  SUPPORT_LINK,
  URL_PRIVACY,
  URL_TERMS,
  URL_WEBSITE
} from '../../shared/constants'

const footerLinks = {
  privacyLink: URL_PRIVACY,
  supportLink: SUPPORT_LINK,
  termsLink: URL_TERMS,
  websiteLink: URL_WEBSITE,
}

const AppController = function(router) {
  // Sending all requests to dashboard view, for Redux Router
  router.get('*', (req, res) => {
    const bundleTemplateVars = renderBundles(req, 'Welcome', 'app', footerLinks)
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
