/**
 * @jest-environment node
 */

const config = require('../email')

describe('config/email', () => {
  test('global', () => {
    expect(config.TOKEN).toBe('')
    expect(config.SUBSCRIBE).toBeDefined()
    expect(config.PASSWORD_RECOVERY).toBeDefined()
    expect(config.REVALIDATE).toBeDefined()
  })
})
