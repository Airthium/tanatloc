/**
 * @jest-environment node
 */

describe('config/sentry', () => {
  test('global', async () => {
    const config = await import('../sentry')
    expect(config.DSN).toBe('')
  })
})

export {}
