/** @module config/email */

// EMAIL TOKEN
const TOKEN = process.env.EMAIL_TOKEN || ''

/**
 * Email types
 */
// SUBSCRIPTION VALIDATION
const SUBSCRIBE = 'subscribe'
// PASSWORD RECOVERY
const PASSWORD_RECOVERY = 'passwordRecovery'

module.exports = {
  TOKEN,
  SUBSCRIBE,
  PASSWORD_RECOVERY
}
