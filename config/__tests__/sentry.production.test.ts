/**
 * @jest-environment node
 */

Object.defineProperty(process.env, 'NODE_ENV', { value: 'production' })

describe('config/sentry', () => {
  test('global', async () => {
    const config = await import('../sentry')
    expect(config.default.DSN.length).toBe(73)
  })
})

export {}
