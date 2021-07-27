/** @module config/email */

// EMAIL TOKEN
const TOKEN = process.env.EMAIL_TOKEN || ''

// TYPES
const PASSWORD_RECOVERY = 'passwordRecovery'

module.exports = {
  TOKEN,
  PASSWORD_RECOVERY
}
