/**
 * @jest-environment node
 */

Object.defineProperty(process, 'platform', {
  value: 'darwin'
})
Object.defineProperty(process.env, 'USER', {
  value: undefined
})
Object.defineProperty(process.env, 'DB_PORT', {
  value: 65432
})

describe('config/db', () => {
  test('global', async () => {
    const config = await import('../db')
    expect(config.ADMIN).toBe('postgres')
    expect(config.ADMIN_DATABASE).toBe('postgres')
    expect(config.ADMIN_PASSWORD).toBe('')
    expect(config.USER).toBe('tanatlocuser')
    expect(config.HOST).toBe('localhost')
    expect(config.PORT).toBe(65432)
    expect(config.DATABASE).toBe('tanatloc2')
    expect(config.PASSWORD).toBe('tanatloc')
  })
})

export {}
