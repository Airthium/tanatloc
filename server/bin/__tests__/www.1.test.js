jest.mock('../../app', () => ({
  set: jest.fn()
}))
jest.mock('http', () => ({
  createServer: () => ({
    address: () => ({}),
    listen: jest.fn(),
    on: jest.fn((param, callback) => {
      if (callback.length === 1) {
        try {
          callback({ syscall: 'not-listen' })
        } catch (err) {
          console.error(err)
        }

        try {
          callback({ syscall: 'listen' })
        } catch (err) {
          console.error(err)
        }

        callback({ syscall: 'listen', code: 'EACCES' })
        callback({ syscall: 'listen', code: 'EADDRINUSE' })
      } else {
        callback({})
      }
    })
  })
}))
global.process.exit = jest.fn()

describe('server/bin/www', () => {
  it('www', async () => {
    await import('../www')
    expect(true).toBe(true)
  })
})
