// @ts-check
/** @type {import('next').NextConfig} */

import Sentry from './config/sentry.js'

const basePath = ''

const nextConfig = {
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser'
    }

    config.node = {
      ...config.node,
      __dirname: true
    }

    config.module.rules.push(
      {
        test: /\.ejs/,
        use: [{ loader: 'ignore-loader' }]
      },
      {
        test: /\.h/,
        use: [{ loader: 'ignore-loader' }]
      },
      {
        test: /\.cpp/,
        use: [{ loader: 'ignore-loader' }]
      }
    )

    config.plugins.push(
      new webpack.IgnorePlugin({ resourceRegExp: /\/__tests__\// })
    )

    return config
  },
  pageExtensions: ['page.tsx', 'api.ts'],
  env: {
    SENTRY_DSN: Sentry.DSN
  },
  basePath,
  output: process.env.NEXT_PUBLIC_SERVER_MODE ? 'export' : undefined
}

export default nextConfig
