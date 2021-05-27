/**
 * @jest-environment node
 */

const config = require('../auth')

describe('config/auth', () => {
  test('global', () => {
    expect(config.SECRET).toBe('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
  })
})
