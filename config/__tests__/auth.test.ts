/**
 * @jest-environment node
 */

import * as config from '../auth'

describe('config/auth', () => {
  test('global', () => {
    expect(config.SECRET).toBe('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    expect(config.MIN_SIZE).toBeDefined()
    expect(config.MAX_SIZE).toBeDefined()
    expect(config.REQUIRE_LETTER).toBeDefined()
    expect(config.REQUIRE_NUMBER).toBeDefined()
    expect(config.REQUIRE_SYMBOL).toBeDefined()
  })
})
