/** @module config/auth */

// Authentication secret
const SECRET = process.env.AUTH_SECRET || new Array(33).join('a')

module.exports = {
  SECRET
}
