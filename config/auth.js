/** @module config/auth */

// Authentication secret
const SECRET = process.env.AUTH_SECRET || new Array(33).join('a')

/**
 * Default password configuration
 */
// Min size
const MIN_SIZE = 6
// Max size
const MAX_SIZE = 16
// Require letter
const REQUIRE_LETTER = true
// Require number
const REQUIRE_NUMBER = true
// Require symbol
const REQUIRE_SYMBOL = true

module.exports = {
  SECRET,
  MIN_SIZE,
  MAX_SIZE,
  REQUIRE_LETTER,
  REQUIRE_NUMBER,
  REQUIRE_SYMBOL
}
