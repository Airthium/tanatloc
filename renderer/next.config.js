/* eslint-disable */
const withLess = require('@zeit/next-less')
const withCSS = require('@zeit/next-css')
const lessToJS = require('less-vars-to-js')
const fs = require('fs')
const path = require('path')

const withTM = require('next-transpile-modules')([
  'drei',
  'three',
  'postprocessing'
])

// Where your antd-custom.less file lives
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './styles/antd.less'), 'utf8')
)

module.exports = withTM(
  withCSS(
    withLess({
      lessLoaderOptions: {
        javascriptEnabled: true,
        modifyVars: themeVariables // make your antd custom effective
      },
      webpack: (config, { isServer }) => {
        if (isServer) {
          const antStyles = /antd\/.*?\/style.*?/
          const origExternals = [...config.externals]
          config.externals = [
            (context, request, callback) => {
              if (request.match(antStyles)) return callback()
              if (typeof origExternals[0] === 'function') {
                origExternals[0](context, request, callback)
              } else {
                callback()
              }
            },
            ...(typeof origExternals[0] === 'function' ? [] : origExternals)
          ]

          config.module.rules.unshift({
            test: antStyles,
            use: 'null-loader'
          })
        }
        return config
      }
    })
  )
)
