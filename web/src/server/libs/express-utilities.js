import { makePermalinkWithString } from '../libs/string-utilities'
import constants from '../../shared/constants'

export const renderBundles = (req, pageTitle, bundleKey, options) => {
  let flash
  if (req.query.message) {
    switch (req.query.message) {
      case 'login':
        flash = {
          type: 'danger',
          message: 'Invalid username or password'
        }
        break
      case 'password':
        flash = {
          type: 'danger',
          message: 'Your passwords don\'t match'
        }
        break
      default:
        break
    }
  }
  return {
    title: `${pageTitle} –– ${constants.PRODUCT_NAME}`,
    flash: flash,
    permalink: makePermalinkWithString(pageTitle),
    css: bundleKey ? req.app.locals.bundles[bundleKey].css : undefined,
    js: bundleKey ? req.app.locals.bundles[bundleKey].js : undefined,
    options: options,
  }
}

/**
 * Normalize a port into a number, string, or false.
 */
export const normalizePort = (val) => {
  const port = parseInt(val, 10)
  if (isNaN(port)) {
    throw new Error('PORT env var must be a number')
  }
  if (port >= 0) {
    // port number
    return port
  }
  return false
}
