const path = require('path')

const withTM = require('next-transpile-modules')([
  'drei',
  'three',
  'postprocessing'
])
const withLess = require('@zeit/next-less')
const withCSS = require('@zeit/next-css')
const withSourceMaps = require('@zeit/next-source-maps')()

const SentryWebpackPlugin = require('@sentry/webpack-plugin')

const basePath = ''
module.exports = {
  webpack: (config, options) => {
    config.target = 'electron-renderer'
    if (!options.isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser'
    }
    config.plugins.push(
      new SentryWebpackPlugin({
        include: '.next',
        ignore: ['node_modules'],
        stripPrefix: ['webpack://_N_E/'],
        urlPrefix: `~${basePath}/_next`
      })
    )
    return config
  },
  ...withSourceMaps({
    serverRunTime: {
      rootDir: __dirname
    },
    ...withLess({
      paths: [path.resolve(__dirname, 'node_modules')],
      lessLoaderOptions: {
        javascriptEnabled: true
      },
      ...withCSS(withTM())
    })
  })
}
