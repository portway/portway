const path = require('path')

const SharedConfig = {
  resolvers: {
    Containers: path.resolve(__dirname, '../src/client/js/containers'),
    Components: path.resolve(__dirname, '../src/client/js/components'),
    Shared: path.resolve(__dirname, '../src/shared'),
    CSS: path.resolve(__dirname, '../src/client/css')
  }
}

module.exports = SharedConfig
