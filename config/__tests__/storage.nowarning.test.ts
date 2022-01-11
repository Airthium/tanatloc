/**
 * @jest-environment node
 */

Object.defineProperty(process.env, 'STORAGE_PATH', { value: 'storage' })

describe('config/storage', () => {
  test('global', async () => {
    const config = await import('../storage')
    expect(config.STORAGE).toBe('storage')

    if (process.platform === 'win32') {
      expect(config.AVATAR).toBe('storage\\avatar')
      expect(config.SIMULATION).toBe('storage\\simulation')
    } else {
      expect(config.AVATAR).toBe('storage/avatar')
      expect(config.SIMULATION).toBe('storage/simulation')
    }
  })
})

export {}
