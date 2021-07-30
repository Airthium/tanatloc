/** @module config/email */
// EMAIL TOKEN
var TOKEN = process.env.EMAIL_TOKEN || '';
/**
 * Email types
 */
// SUBSCRIPTION VALIDATION

var SUBSCRIBE = 'subscribe'; // PASSWORD RECOVERY

var PASSWORD_RECOVERY = 'passwordRecovery'; // REVALIDATE

var REVALIDATE = 'revalidate';
module.exports = {
  TOKEN: TOKEN,
  SUBSCRIBE: SUBSCRIBE,
  PASSWORD_RECOVERY: PASSWORD_RECOVERY,
  REVALIDATE: REVALIDATE
};