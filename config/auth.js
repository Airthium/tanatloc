/** @module config/auth */

/**
 * Authentication secret
 */
module.exports = {
  SECRET: process.env.AUTH_SECRET || 'auth_secret'
}
