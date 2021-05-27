/**
 * @jest-environment node
 */

const config = require('../email')

describe('config/email', () => {
  test('global', () => {
    expect(config.TOKEN).toBe('')
  })
})
