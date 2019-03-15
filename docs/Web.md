
# Express and Webpack Build

The setup for Express and Webpack is quite complex. Here is an outline on what's going on.

**Bundles**

* Each individual bundle needs an entry in the `exportedEntrypoints` object in `web/config/entryPoints.js`
* A vendor bundle is created for each entry point to reduce bundle size
* In production, bundles are hashed based on their content for caching / performance purposes

**Development**

* Express uses `webpack-dev-middleware` and `webpack-hot-middleware` to serve up the webpack bundles.
* A `bundles` object is created based off of the webpack.config's entry point keys using a custom webpack plugin `BundleBuilderPlugin` in `server/app.js`
* This `bundles` object is available to the entire Express app using `app.locals.bundles`
* Each Express View can access these development bundles that `webpack-dev-middleware` is serving up in memory
* Lastly, the webpack.config is adding the hot middleware entry point when in development mode. See `entryPoints` in webpack.config.js

**Production**

* Webpack creates a manifest file of hashed bundles using the `WebpackAssetsManifest` plugin, and puts it in the public directory.
* Express ignores Webpack middleware all together in production, assigning the dynamically hashed bundles to `app.locals.bundles` via the manifest.
* Hot reloading is completely ignored in production – see `entryFunction` and `entryPoints` in webpack.config.js
* We are gzipping / minifying / and splitting code using react-loader
