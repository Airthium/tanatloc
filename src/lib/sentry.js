import sentryConfig from '../../config/sentry'
import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: sentryConfig.SENTRY_DSN
})

export default Sentry
