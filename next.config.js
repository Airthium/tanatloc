const path = require('path')

const withTM = require('next-transpile-modules')(['three'])
const withImages = require('next-images')
const withLess = require('@zeit/next-less')

const sentryConfig = require('./config/sentry')

const basePath = ''

module.exports = withLess({
  paths: [path.resolve(__dirname, 'node_modules')],
  lessLoaderOptions: {
    javascriptEnabled: true
  },
  ...withImages(
    withTM({
      webpack: (config, { isServer, webpack }) => {
        if (!isServer) {
          config.resolve.alias['@sentry/node'] = '@sentry/browser'
        }

        config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//))

        return config
      },
      env: {
        SENTRY_DSN: sentryConfig.DSN
      },
      basePath
    })
  )
})
