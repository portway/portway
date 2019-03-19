import webpackConfig from '../../../config/webpack.dev'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import EntryPointWithSiblings from '../../../config/plugins/entryPointWithSiblings'

export default function(app) {
  // Enable the Webpack middleware, with Webpack options
  // const compiler = webpack(webpackConfig)
  const compiler = webpack(webpackConfig)

  // Dynamically feed updated entrypoint data from webpack to app.locals.bundles
  const entryPointPlugin = new EntryPointWithSiblings({
    callback: (stats, bundles) => {
      console.info('setting app.locals.bundles')
      console.info(bundles)
      app.locals.bundles = bundles
    }
  })
  entryPointPlugin.apply(compiler)

  // Use webpack middleware
  app.use(
    webpackMiddleware(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath,
      mode: 'development',
      stats: 'minimal'
    })
  )

  // Enable Webpack hot reloading with Express
  app.use(webpackHotMiddleware(compiler))
}
