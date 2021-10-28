const withTM = require('next-transpile-modules')(['three'])
const withLess = require('next-with-less')

const sentryConfig = require('./config/sentry')

const basePath = ''

module.exports = withLess({
  ...withTM({
    webpack: (config, { isServer, webpack }) => {
      if (!isServer) {
        config.resolve.alias['@sentry/node'] = '@sentry/browser'
      }

      config.node = {
        ...config.node,
        __dirname: true
      }

      config.module.rules.push({
        test: /\.ejs/,
        use: [{ loader: 'ignore-loader' }]
      })

      config.plugins.push(
        new webpack.IgnorePlugin({ resourceRegExp: /\/__tests__\// })
      )

      return config
    },
    env: {
      SENTRY_DSN: sentryConfig.DSN
    },
    basePath
  })
})
