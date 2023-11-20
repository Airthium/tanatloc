/** @module Lib.Sentry */

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN
})

export default Sentry
