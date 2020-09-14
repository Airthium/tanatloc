import config from '../../config/sentry'
import * as Sentry from '@sentry/node'
import { Integrations } from '@sentry/tracing'

Sentry.init({
  dsn: config.DSN,
  integrations: [new Integrations.BrowserTracing()]
})

Sentry.configureScope((scope) => {
  scope.setTag('Tanatloc')
})

export default Sentry
