/**
 * @jest-environment node
 */

import * as config from '../string'

describe('config/string', () => {
  test('global', () => {
    expect(config.LIMIT).toBe(50)
  })
})
