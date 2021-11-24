/**
 * @jest-environment node
 */

Object.defineProperty(process.env, 'STORAGE_PATH', { value: 'storage' })

describe('config/storage', () => {
  test('global', async () => {
    const config = await import('../storage')
    expect(config.STORAGE).toBe('storage')
    expect(config.AVATAR).toBe('storage/avatar')
    expect(config.SIMULATION).toBe('storage/simulation')
  })
})

export {}
