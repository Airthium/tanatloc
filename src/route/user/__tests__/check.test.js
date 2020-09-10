import check from '../check'

let mockSession = () => false
jest.mock('../../session', () => () => mockSession())

let mockLogin
jest.mock('../../../lib/user', () => ({
  login: () => mockLogin()
}))

describe('src/route/user/check', () => {
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
    await check(req, res)
    expect(response).toBe(undefined)
  })

  it('session', async () => {
    mockSession = () => true
    mockLogin = async () => ({})
    await check(req, res)
    expect(response).toEqual({ valid: true })
  })

  it('not authorized', async () => {
    mockSession = () => true
    mockLogin = async () => {}
    await check(req, res)
    expect(response).toEqual({ valid: false })
  })
})
