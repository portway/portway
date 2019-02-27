import webpackConfig from '../../../config/webpack.dev'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

export default function(app) {
  // Enable the Webpack middleware, with Webpack options
  // const compiler = webpack(webpackConfig)
  const compiler = webpack(webpackConfig)

  // Get the files and dependent chunks for each bundle
  compiler.hooks.done.tap('BundleBuilderPlugin', (stats) => {
    // Best way to find file extension of a string
    // https://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
    const fileExtReg = /(?:\.([^.]+))?$/
    const webpackStats = stats.toJson('normal').chunks
    const bundles = {}
    webpackStats.forEach((bundle) => {
      // Only if the bundle is an entryPoint in webpack config
      if (bundle.entry) {
        console.info(`Entrypoint: ${bundle.id}`)
        const files = bundle.files
        const cssFiles = files.filter(file => fileExtReg.exec(file)[1] === 'css')
        const jsFiles = files.filter(file => fileExtReg.exec(file)[1] === 'js')
        // If the entryPoint has siblings, get their bundle files
        const siblingFiles = []
        if (bundle.siblings.length > 0) {
          const siblings = bundle.siblings
          siblings.forEach((sibling) => {
            // Will bundles always have one file?
            siblingFiles.push(webpackStats.find(b => b.id === sibling).files[0])
          })
        }
        bundles[`${bundle.id}`] = {
          css: cssFiles,
          js: jsFiles.concat(siblingFiles)
        }
      }
    })
    app.locals.bundles = bundles
  })

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