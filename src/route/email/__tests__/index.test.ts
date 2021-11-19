import { IRequest, IResponse } from '@/route'
import email from '..'
import { PASSWORD_RECOVERY } from '@/config/email'

const mockError = jest.fn()
jest.mock('../../error', () => ({
  error: (status: number, message: string) => mockError(status, message)
}))

const mockEmailRecover = jest.fn()
jest.mock('@/lib/email', () => ({
  recover: async () => mockEmailRecover()
}))

const mockUserGetBy = jest.fn()
jest.mock('@/lib/user', () => ({
  getBy: async () => mockUserGetBy()
}))

describe('route/email', () => {
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
    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockEmailRecover.mockReset()

    mockUserGetBy.mockReset()

    resStatus = undefined
    resJson = undefined
  })

  test('PUT', async () => {
    req.method = 'PUT'

    // Wrong body
    await email(
      {
        ...req,
        //@ts-ignore
        body: {}
      },
      res
    )
    expect(mockUserGetBy).toHaveBeenCalledTimes(0)
    expect(mockEmailRecover).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { email(string), type(string) }'
    })

    // Wrong type
    await email({ ...req, body: { type: 'wrong type', email: 'email' } }, res)
    expect(mockUserGetBy).toHaveBeenCalledTimes(0)
    expect(mockEmailRecover).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Type wrong type not allowed'
    })

    // Good type, no user
    await email(
      { ...req, body: { type: PASSWORD_RECOVERY, email: 'email' } },
      res
    )
    expect(mockUserGetBy).toHaveBeenCalledTimes(1)
    expect(mockEmailRecover).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Good type, user
    mockUserGetBy.mockImplementation(() => ({}))
    await email(
      { ...req, body: { type: PASSWORD_RECOVERY, email: 'email' } },
      res
    )
    expect(mockUserGetBy).toHaveBeenCalledTimes(2)
    expect(mockEmailRecover).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Error
    mockUserGetBy.mockImplementation(() => {
      throw new Error('User error')
    })
    await email(
      { ...req, body: { type: PASSWORD_RECOVERY, email: 'email' } },
      res
    )
    expect(mockUserGetBy).toHaveBeenCalledTimes(3)
    expect(mockEmailRecover).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(3)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'User error' })
  })

  test('wrong method', async () => {
    req.method = 'method'

    await email(
      { ...req, body: { type: PASSWORD_RECOVERY, email: 'email' } },
      res
    )
    expect(mockUserGetBy).toHaveBeenCalledTimes(0)
    expect(mockEmailRecover).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
