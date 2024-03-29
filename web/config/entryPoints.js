const middlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&name='

const exportedEntrypoints = {
  index: ['./src/client/css/index.scss'],
  signup: ['./src/client/css/index.scss', './src/client/js/signup.js'],
  registration: ['./src/client/css/index.scss', './src/client/js/registration.js'],
  passwordReset: ['./src/client/css/index.scss', './src/client/js/passwordReset.js'],
  app: ['./src/client/js/index.js']
}

if (process.env.NODE_ENV === 'development') {
  const entryPoints = Object.keys(exportedEntrypoints)
  entryPoints.forEach((entryPoint) => {
    console.info(`Add middleware to ${entryPoint}`)
    exportedEntrypoints[entryPoint].push(`${middlewareScript}${entryPoint}`)
  })
}

module.exports = exportedEntrypoints
