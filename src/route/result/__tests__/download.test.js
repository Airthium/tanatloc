import download from '../download'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockDownload = jest.fn()
jest.mock('@/lib/result', () => ({
  download: async () => mockDownload()
}))

const mockError = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockError()
}))

describe('route/result/download', () => {
  const req = {
    method: 'POST'
  }
  let response
  const res = {
    status: () => ({
      json: (obj) => {
        response = obj
      },
      end: () => {
        response = 'end'
      }
    })
  }

  beforeEach(() => {
    mockSession.mockReset()
    mockSession.mockImplementation(() => false)

    mockDownload.mockReset()
    mockDownload.mockImplementation(() => ({
      pipe: jest.fn()
    }))

    mockError.mockReset()
  })

  test('no session', async () => {
    await download(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockDownload).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
  })

  test('POST', async () => {
    mockSession.mockImplementation(() => 'id')

    await download(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockDownload).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockDownload.mockImplementation(() => {
      throw new Error('test')
    })
    await download(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockDownload).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  test('wrong method', async () => {
    req.method = 'SOMETHING'

    mockSession.mockImplementation(() => true)

    await download(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockDownload).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      error: true,
      message: 'Method SOMETHING not allowed'
    })
  })
})
