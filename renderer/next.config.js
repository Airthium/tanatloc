const path = require('path')

const withTM = require('next-transpile-modules')(['three', 'postprocessing'])
const withLess = require('@zeit/next-less')
const withCSS = require('@zeit/next-css')

const basePath = ''

module.exports = withLess({
  paths: [path.resolve(__dirname, 'node_modules')],
  lessLoaderOptions: {
    javascriptEnabled: true
  },
  ...withCSS(
    withTM({
      webpack: (config, options) => {
        if (!options.isServer) {
          config.resolve.alias['@sentry/node'] = '@sentry/browser'
        }
        return config
      },
      basePath
    })
  )
})
