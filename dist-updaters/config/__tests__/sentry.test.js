/**
 * @jest-environment node
 */
describe('config/sentry', function () {
  test('global', function () {
    var config = require("../sentry");

    expect(config.DSN).toBe('');
  });
});