const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries')
const entryPoints = require('./entryPoints.js')

const globalStyleLoaders = [
  {
    loader: 'css-loader',
    options: {
      sourceMap: true
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: true,
      config: {
        path: path.resolve(__dirname, './postcss.config.js')
      }
    }
  },
  {
    loader: 'sass-loader',
    options: {
      sourceMap: true
    }
  }
]

module.exports = {
  mode: 'development',
  entry: entryPoints,
  output: {
    path: path.resolve(__dirname, '../src/server/public'),
    filename: 'js/[name].bundle.js',
    chunkFilename: 'js/[name].bundle.js',
    publicPath: '/'
  },
  plugins: [
    new FixStyleOnlyEntriesPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css'
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../src/client/images'),
        to: 'images'
      },
      {
        from: path.resolve(__dirname, '../src/client/manifest.webmanifest'),
        to: 'manifest.webmanifest'
      }
    ]),
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    alias: {
      Containers: path.resolve(__dirname, '../src/client/js/containers'),
      Components: path.resolve(__dirname, '../src/client/js/components')
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        include: [path.resolve(__dirname, '../src/client/css')],
        use: [MiniCssExtractPlugin.loader, ...globalStyleLoaders]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        include: [path.resolve(__dirname, '../src/client/js/components')],
        use: ['style-loader', ...globalStyleLoaders]
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8000, // Convert images < 8kb to base64 strings
              name: 'images/[hash]-[name].[ext]'
            }
          }
        ]
      }
    ]
  }
}
