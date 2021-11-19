import { IRequest, IResponse, IRouteError } from '@/route'
import check from '../check'

const mockSession = jest.fn()
jest.mock('../../session', () => ({
  session: () => mockSession()
}))

const mockError = jest.fn()
jest.mock('../../error', () => ({
  error: (status: number, message: string) => mockError(status, message)
}))

const mockLogin = jest.fn()
jest.mock('@/lib/user', () => ({
  login: async () => mockLogin()
}))

describe('route/user/check', () => {
  const req: IRequest = {}
  let resStatus: number
  let resJson: any
  const res: IResponse = {
    setHeader: jest.fn,
    status: (status: number) => {
      resStatus = status
      return res
    },
    end: () => {
      resJson = 'end'
      return res
    },
    json: (value: object) => {
      resJson = value
      return res
    }
  }

  beforeEach(() => {
    mockSession.mockReset()

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockLogin.mockReset()

    resStatus = undefined
    resJson = undefined
  })

  test('no session', async () => {
    mockSession.mockImplementation(() => {
      const error: IRouteError = new Error('Unauthorized')
      error.status = 401
      throw error
    })
    await check(
      {
        ...req,
        body: {
          email: 'email',
          password: 'password'
        }
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockLogin).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({
      error: true,
      message: 'Unauthorized'
    })
  })

  test('POST', async () => {
    req.method = 'POST'

    // Wrong body
    await check(
      {
        ...req,
        //@ts-ignore
        body: {}
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockLogin).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { email(string), password(string) })'
    })

    // Normal - invalid
    await check(
      {
        ...req,
        body: {
          email: 'email',
          password: 'password'
        }
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockLogin).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({
      valid: false
    })

    // Normal - valid
    mockLogin.mockImplementation(() => ({}))
    await check(
      {
        ...req,
        body: {
          email: 'email',
          password: 'password'
        }
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockLogin).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({
      valid: true
    })

    // Error
    mockLogin.mockImplementation(() => {
      throw new Error('Login error')
    })
    await check(
      {
        ...req,
        body: {
          email: 'email',
          password: 'password'
        }
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(4)
    expect(mockLogin).toHaveBeenCalledTimes(3)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Login error'
    })
  })

  test('wrong method', async () => {
    req.method = 'method'

    await check(
      {
        ...req,
        body: {
          email: 'email',
          password: 'password'
        }
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockLogin).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
