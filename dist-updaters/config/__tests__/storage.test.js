/**
 * @jest-environment node
 */
var config = require("../storage");

jest.mock('os', function () {
  return {
    homedir: function homedir() {
      return '/homedir';
    }
  };
});
describe('config/storage', function () {
  test('global', function () {
    expect(config.STORAGE).toBe('/homedir/tanatloc');
    expect(config.AVATAR).toBe('/homedir/tanatloc/avatar');
    expect(config.SIMULATION).toBe('/homedir/tanatloc/simulation');
  });
});