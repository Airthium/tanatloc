jest.mock('../../app', () => ({
  set: jest.fn()
}))
jest.mock('http', () => ({
  createServer: () => ({
    address: () => 'address',
    listen: jest.fn(),
    on: jest.fn((param, callback) => {
      if (callback.length === 1) {
        try {
          callback({ syscall: 'listen' })
        } catch (err) {
          console.error(err)
        }
      } else {
        callback({})
      }
    })
  })
}))
Object.defineProperty(process, 'env', { value: { PORT: 'port' } })

describe('server/bin/www', () => {
  test('www', async () => {
    await import('../www')
    expect(true).toBe(true)
  })
})

export {}
