const fileExtReg = /(?:\.([^.]+))?$/
const CSS_REGEX_FUNC = file => fileExtReg.exec(file)[1] === 'css'
const JS_REGEX_FUNC = file => fileExtReg.exec(file)[1] === 'js'

class EntryPointPlugin {
  constructor(options) {
    if (typeof options.callback !== 'function') {
      throw new Error('EntryPointPlugin requires options.callback function arg')
    }
    this.callback = options.callback
  }
  apply(compiler) {
    // Get the files and dependent chunks for each bundle
    compiler.hooks.done.tap('BundleBuilderPlugin', (stats) => {
      // Best way to find file extension of a string
      // eslint-disable-next-line max-len
      // https://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
      const webpackStats = stats.toJson('normal').chunks

      const bundles = {}
      webpackStats.forEach((bundle) => {
        // Only if the bundle is an entryPoint in webpack config
        if (bundle.entry) {
          const files = bundle.files
          const cssFiles = files.filter(CSS_REGEX_FUNC)
          const jsFiles = files.filter(JS_REGEX_FUNC)
          // If the entryPoint has siblings, get their bundle files
          const siblingJsFiles = []
          const siblingCssFiles = []
          if (bundle.siblings.length > 0) {
            const siblings = bundle.siblings

            siblings.forEach((sibling) => {
              const siblingFullFile = webpackStats.find(b => b.id === sibling)
              const siblingFile = siblingFullFile.files[0]
              if (CSS_REGEX_FUNC(siblingFile)) {
                siblingCssFiles.push(siblingFile)
              } else if (JS_REGEX_FUNC(siblingFile)) {
                siblingJsFiles.push(siblingFile)
              }
            })
          }
          const name = bundle.names[0]
          bundles[name] = {
            css: cssFiles.concat(siblingCssFiles),
            js: jsFiles.concat(siblingJsFiles)
          }
        }
      })
      this.callback(stats, bundles)
    })
  }
}

module.exports = EntryPointPlugin
