/** @module config/auth */
// Authentication secret
var SECRET = process.env.AUTH_SECRET || new Array(33).join('a');
/**
 * Default password configuration
 */
// Min size

var MIN_SIZE = 6; // Max size

var MAX_SIZE = 16; // Require letter

var REQUIRE_LETTER = true; // Require number

var REQUIRE_NUMBER = true; // Require symbol

var REQUIRE_SYMBOL = true;
module.exports = {
  SECRET: SECRET,
  MIN_SIZE: MIN_SIZE,
  MAX_SIZE: MAX_SIZE,
  REQUIRE_LETTER: REQUIRE_LETTER,
  REQUIRE_NUMBER: REQUIRE_NUMBER,
  REQUIRE_SYMBOL: REQUIRE_SYMBOL
};