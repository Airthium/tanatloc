// @ts-check

import Sentry from './config/sentry.js'

const basePath = ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { webpack }) => {
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
      },
      {
        test: /\.d.ts/,
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
  output: process.env.NEXT_PUBLIC_SERVER_MODE ? 'export' : undefined,
  distDir: process.env.NEXT_PUBLIC_SERVER_MODE ? 'renderer' : undefined,
  transpilePackages: [
    // antd & deps
    '@ant-design',
    '@rc-component',
    'antd',
    'rc-cascader',
    'rc-checkbox',
    'rc-collapse',
    'rc-dialog',
    'rc-drawer',
    'rc-dropdown',
    'rc-field-form',
    'rc-image',
    'rc-input',
    'rc-input-number',
    'rc-mentions',
    'rc-menu',
    'rc-motion',
    'rc-notification',
    'rc-pagination',
    'rc-picker',
    'rc-progress',
    'rc-rate',
    'rc-resize-observer',
    'rc-segmented',
    'rc-select',
    'rc-slider',
    'rc-steps',
    'rc-switch',
    'rc-table',
    'rc-tabs',
    'rc-textarea',
    'rc-tooltip',
    'rc-tree',
    'rc-tree-select',
    'rc-upload',
    'rc-util',
    // electron-store
    'electron-store'
  ]
}

export default nextConfig
