import email from '..'

const mockEmailRecover = jest.fn()
jest.mock('@/lib/email', () => ({
  recover: async () => mockEmailRecover()
}))

const mockUserGetBy = jest.fn()
jest.mock('@/lib/user', () => ({
  getBy: async () => mockUserGetBy()
}))

const mockError = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockError()
}))

describe('route/email', () => {
  let response
  const res = {
    status: () => ({
      json: (obj) => (response = obj),
      end: () => (response = 'end')
    })
  }
  const req = {
    method: 'PUT',
    body: {}
  }

  beforeEach(() => {
    mockEmailRecover.mockReset()

    mockUserGetBy.mockReset()

    mockError.mockReset()

    response = undefined
  })

  test('PUT', async () => {
    // Wrong type
    req.body = {
      type: 'not allowed'
    }
    await email(req, res)
    expect(mockError).toHaveBeenCalledTimes(1)

    // Good type, no user
    req.body = {
      type: 'passwordRecovery'
    }
    await email(req, res)
    expect(mockUserGetBy).toHaveBeenCalledTimes(1)
    expect(mockEmailRecover).toHaveBeenCalledTimes(0)

    // Good type, user
    mockUserGetBy.mockImplementation(() => ({}))
    await email(req, res)
    expect(mockUserGetBy).toHaveBeenCalledTimes(2)
    expect(mockEmailRecover).toHaveBeenCalledTimes(1)
    expect(response).toBe('end')

    // Error
    mockUserGetBy.mockImplementation(() => {
      throw new Error()
    })
    await email(req, res)
    expect(mockError).toHaveBeenCalledTimes(2)
  })

  test('wrong method', async () => {
    req.method = 'SOMETHING'

    await email(req, res)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      error: true,
      message: 'Method SOMETHING not allowed'
    })
  })
})
