/** @namespace Lib.Sentry */

import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: process.env.SENTRY_DSN
})

export default Sentry
