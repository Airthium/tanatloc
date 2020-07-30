jest.mock('../../app', () => ({
  set: jest.fn()
}))
jest.mock('http', () => ({
  createServer: () => ({
    address: () => ({}),
    listen: jest.fn(),
    on: jest.fn()
  })
}))
global.process.env.PORT = -1

describe('server/bin/www', () => {
  it('www', async () => {
    await import('../www')
    expect(true).toBe(true)
  })
})
