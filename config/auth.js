/** @module config/auth */

/**
 * Authentication secret
 */
module.exports = {
  SECRET: process.env.AUTH_SECRET || new Array(33).join('a')
}
