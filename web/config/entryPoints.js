
const middlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&name='
const exportedEntrypoints = {
  'index': [
    './src/client/js/index.js',
    './src/client/css/index.scss'
  ],
  'registration': [
    './src/client/css/registration.scss'
  ]
}
if (process.env.NODE_ENV === 'development') {
  const entryPoints = Object.keys(exportedEntrypoints)
  entryPoints.forEach((entryPoint) => {
    console.log(`Add middleware to ${entryPoint}`)
    exportedEntrypoints[entryPoint].push(`${middlewareScript}${entryPoint}.css`) // .css is a hack
  })
}

module.exports = exportedEntrypoints
