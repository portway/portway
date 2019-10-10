import path from 'path'
import express from 'express'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import webpackConfig from '../../../config/webpack.dev'
import EntryPointWithSiblings from '../../../config/plugins/entryPointWithSiblings'
import controllerLoader from '../controllers/loader'
import { PATH_APP } from '../../shared/constants'

export default function(app) {
  // Enable the Webpack middleware, with Webpack options
  const compiler = webpack(webpackConfig)

  // Dynamically feed updated entrypoint data from webpack to app.locals.bundles
  const entryPointPlugin = new EntryPointWithSiblings({
    callback: (stats, bundles) => {
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

  const router = express.Router()
  controllerLoader(router)
  app.use(router)

  // /d/*

  router.get(`${PATH_APP}/*`, (req, res, next) => {
    const filename = path.join(compiler.outputPath, '../app.html')
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        return next(err)
      }
      res.set('content-type', 'text/html')
      res.send(result)
      res.end()
    })
  })

  // Enable Webpack hot reloading with Express
  app.use(webpackHotMiddleware(compiler))
}
