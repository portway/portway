// Include in every endpoint
if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept()
}
