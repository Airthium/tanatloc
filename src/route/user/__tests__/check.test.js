import check from '../check'

let mockSession = () => false
jest.mock('../../session', () => () => mockSession())

let mockLogin
jest.mock('../../../lib/user', () => ({
  login: () => mockLogin()
}))

const mockSentry = jest.fn()
jest.mock('../../../lib/sentry', () => ({
  captureException: () => mockSentry()
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

  it('error', async () => {
    mockLogin = async () => {
      throw new Error()
    }
    await check(req, res)
    expect(mockSentry).toHaveBeenCalledTimes(1)
  })
})
