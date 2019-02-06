
const middlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&name='

module.exports = {
  'index': [
    './src/client/js/index.js',
    './src/client/css/index.scss',
    middlewareScript + 'index'
  ],
  'registration': [
    './src/client/css/registration.scss'
  ]
}
