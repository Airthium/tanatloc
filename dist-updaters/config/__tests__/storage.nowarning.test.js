/**
 * @jest-environment node
 */
process.env.STORAGE_PATH = 'storage';

var config = require("../storage");

describe('config/storage', function () {
  test('global', function () {
    expect(config.STORAGE).toBe('storage');
    expect(config.AVATAR).toBe('storage/avatar');
    expect(config.SIMULATION).toBe('storage/simulation');
  });
});