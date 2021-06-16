import archive from '../archive'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockArchive = jest.fn()
jest.mock('@/lib/result', () => ({
  archive: async () => mockArchive()
}))

const mockError = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockError()
}))

describe('route/result/archive', () => {
  const req = {
    method: 'POST'
  }
  let response
  const res = {
    setHeader: jest.fn(),
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

    mockArchive.mockReset()
    mockArchive.mockImplementation(() => ({
      pipe: jest.fn()
    }))

    mockError.mockReset()
  })

  test('no session', async () => {
    await archive(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockArchive).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
  })

  test('POST', async () => {
    mockSession.mockImplementation(() => 'id')

    await archive(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockArchive).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockArchive.mockImplementation(() => {
      throw new Error('test')
    })
    await archive(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockArchive).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  test('wrong method', async () => {
    req.method = 'SOMETHING'

    mockSession.mockImplementation(() => true)

    await archive(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockArchive).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      error: true,
      message: 'Method SOMETHING not allowed'
    })
  })
})
