/**
 * @jest-environment node
 */

const config = require('../domain')

describe('config/domain', () => {
  test('global', () => {
    expect(config.DOMAIN).toBeDefined()
  })
})
