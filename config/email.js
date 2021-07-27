/** @module config/email */

// EMAIL TOKEN
const TOKEN = process.env.EMAIL_TOKEN || ''

// TYPES
const SUBSCRIBE = 'subscribe'
const PASSWORD_RECOVERY = 'passwordRecovery'

module.exports = {
  TOKEN,
  SUBSCRIBE,
  PASSWORD_RECOVERY
}
