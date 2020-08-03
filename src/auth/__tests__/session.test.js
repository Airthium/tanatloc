import session from '../session'

jest.mock('cookie', () => ({
  parse: (cookie) => cookie,
  serialize: jest.fn()
}))

jest.mock('@hapi/iron', () => ({
  unseal: async () => {},
  seal: async () => {}
}))

describe('src/auth', () => {
  it('session', async () => {
    const s = session({ name: 'name' })
    expect(s).toBeDefined()

    const res = { end: { apply: jest.fn() } }
    const next = jest.fn()
    await s({ headers: {} }, res, next)
    expect(next).toHaveBeenCalledTimes(1)

    await s({ headers: { cookie: { name: {} } } }, res, next)
    expect(next).toHaveBeenCalledTimes(2)

    res.setHeader = jest.fn()
    await res.end()

    res.finished = true
    await res.end()
  })
})
