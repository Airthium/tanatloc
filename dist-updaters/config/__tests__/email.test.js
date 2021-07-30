/**
 * @jest-environment node
 */
var config = require("../email");

describe('config/email', function () {
  test('global', function () {
    expect(config.TOKEN).toBe('');
    expect(config.SUBSCRIBE).toBeDefined();
    expect(config.PASSWORD_RECOVERY).toBeDefined();
    expect(config.REVALIDATE).toBeDefined();
  });
});