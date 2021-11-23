/**
 * @jest-environment node
 */

import * as config from '../domain'

describe('config/domain', () => {
  test('global', () => {
    expect(config.DOMAIN).toBeDefined()
  })
})
