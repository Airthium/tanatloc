import sentryConfig from '../../config/sentry'
import * as Sentry from '@sentry/node'
import { RewriteFrames } from '@sentry/integrations'
import getConfig from 'next/config'

const config = getConfig()
const distDir = `${config.serverRuntimeConfig.rootDir}/.next`

Sentry.init({
  dsn: sentryConfig.DSN,
  integrations: [
    new RewriteFrames({
      iteratee: (frame) => {
        frame.filename = frame.filename.replace(distDir, 'app:///_next')
        return frame
      }
    })
  ]
})

Sentry.configureScope((scope) => {
  scope.setTag('Tanatloc')
})

export default Sentry
