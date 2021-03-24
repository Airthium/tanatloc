import organizations from '../'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockGetByUser = jest.fn()
jest.mock('@/lib/organization', () => ({
  getByUser: async () => mockGetByUser()
}))

const mockError = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockError()
}))

describe('route/groups', () => {
  let req, response
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

    mockGetByUser.mockReset()

    mockError.mockReset()

    req = {
      method: 'GET'
    }
    response = undefined
  })

  it('no session', async () => {
    await organizations(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toBe(undefined)
  })

  it('GET', async () => {
    req.method = 'GET'

    mockSession.mockImplementation(() => 'id')
    mockGetByUser.mockImplementation(() => [
      {
        id: 'id'
      }
    ])

    await organizations(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGetByUser).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ organizations: [{ id: 'id' }] })

    // Error
    mockGetByUser.mockImplementation(() => {
      throw new Error('test')
    })
    await organizations(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockGetByUser).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  it('wrong method', async () => {
    req.method = 'SOMETHING'

    mockSession.mockImplementation(() => true)

    await organizations(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      error: true,
      message: 'Method SOMETHING not allowed'
    })
  })
})
