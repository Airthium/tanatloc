const withAntdLess = require('next-plugin-antd-less')

const { DSN } = require('./config/sentry.js')

const basePath = ''

module.exports = withAntdLess({
  lessVarsFilePath: './src/styles/global.less',
  lessVarsFilePathAppendToEndOfContent: true,
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
    SENTRY_DSN: DSN
  },
  basePath
})
