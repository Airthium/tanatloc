const path = require('path')
const withTM = require('next-transpile-modules')([
  'drei',
  'three',
  'postprocessing'
])
const withLess = require('@zeit/next-less')
const withCSS = require('@zeit/next-css')

module.exports = {
  webpack: (config) =>
    Object.assign(config, {
      target: 'electron-renderer'
    }),
  ...withLess({
    paths: [path.resolve(__dirname, 'node_modules')],
    lessLoaderOptions: {
      javascriptEnabled: true
    },
    ...withCSS(withTM())
  })
}
