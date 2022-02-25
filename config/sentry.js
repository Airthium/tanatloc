/** @module Config.Sentry */

/**
 * Sentry DNS
 * @description Set to Tanatloc Sentry DSN for production build only
 */
let DSN = ''
if (process.env.NODE_ENV === 'production')
  DSN =
    'https://3bb27cb32e55433696022ba93cb32430@o394613.ingest.sentry.io/5428383'

module.exports = { DSN }
