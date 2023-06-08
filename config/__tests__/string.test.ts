/**
 * @jest-environment node
 */

import * as config from '../string'

describe('config/string', () => {
  test('global', () => {
    expect(config.LIMIT50).toBe(50)
    expect(config.LIMIT120).toBe(120)
  })
})
