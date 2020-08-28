import user from '..'

let mockSession = () => false
jest.mock('../../session', () => () => mockSession())

jest.mock('../../../lib/user', () => ({
  get: async () => ({
    username: 'username'
  })
}))

describe('src/route/user', () => {
  const req = {}
  let response
  const res = {
    status: () => ({
      json: (obj) => {
        response = obj
      }
    })
  }

  it('no session', async () => {
    mockSession = () => false
    await user(req, res)
    expect(response).toBe(undefined)
  })

  it('session', async () => {
    mockSession = () => true
    await user(req, res)
    expect(response).toEqual({
      user: {
        username: 'username'
      }
    })
  })
})
