import webpackConfig from '../../../config/webpack.dev'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

export default function(app) {
  // Enable the Webpack middleware, with Webpack options
  // const compiler = webpack(webpackConfig)
  const compiler = webpack(webpackConfig)

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
