import config from '../../config/sentry'
import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: config.DSN
})

Sentry.configureScope((scope) => {
  scope.setTag('Tanatloc')
})

export default Sentry
