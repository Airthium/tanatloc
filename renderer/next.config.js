const path = require('path')

const withTM = require('next-transpile-modules')(['three', 'postprocessing'])
const withLess = require('@zeit/next-less')
const withCSS = require('@zeit/next-css')

const sentryConfig = require('../config/sentry')

const basePath = ''

module.exports = withLess({
  paths: [path.resolve(__dirname, 'node_modules')],
  lessLoaderOptions: {
    javascriptEnabled: true
  },
  ...withCSS(
    withTM({
      webpack: (config, options) => {
        config.module.rules.push({
         test: /\.(woff|woff2|eot|ttf|otf)$/,
         use: [
           'url-loader',
         ],
       })
        if (!options.isServer) {
          config.resolve.alias['@sentry/node'] = '@sentry/browser'
        }
        return config
      },
      env: {
        SENTRY_DSN: sentryConfig.DSN
      },
      basePath
    })
  )
})
