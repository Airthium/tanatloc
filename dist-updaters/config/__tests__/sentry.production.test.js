/**
 * @jest-environment node
 */
process.env.NODE_ENV = 'production';
describe('config/sentry', function () {
  test('global', function () {
    var config = require("../sentry");

    expect(config.DSN.length).toBe(73);
  });
});