import link from '..'

const mockLinkGet = jest.fn()
const mockLinkProcess = jest.fn()
jest.mock('@/lib/link', () => ({
  get: async () => mockLinkGet(),
  process: async () => mockLinkProcess()
}))

const mockError = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockError()
}))

describe('route/link', () => {
  let response
  const res = {
    status: () => ({
      json: (obj) => (response = obj),
      end: () => (response = 'end')
    })
  }
  const req = {
    method: 'POST',
    body: {}
  }

  beforeEach(() => {
    mockError.mockReset()
  })

  test('POST', async () => {
    // Normal
    await link(req, res)
    expect(mockLinkGet).toHaveBeenCalledTimes(1)
    expect(response).toEqual()

    // Error
    mockLinkGet.mockImplementation(() => {
      throw new Error()
    })
    await link(req, res)
    expect(mockLinkGet).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: '' })
  })

  test('PUT', async () => {
    req.method = 'PUT'

    // Normal
    await link(req, res)
    expect(mockLinkProcess).toHaveBeenCalledTimes(1)
    expect(response).toBe('end')

    // Error
    mockLinkProcess.mockImplementation(() => {
      throw new Error()
    })
    await link(req, res)
    expect(mockLinkProcess).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: '' })
  })

  test('wrong method', async () => {
    req.method = 'SOMETHING'

    await link(req, res)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      error: true,
      message: 'Method SOMETHING not allowed'
    })
  })
})
