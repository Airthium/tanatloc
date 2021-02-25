import groups from '../'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockGetAll = jest.fn()
jest.mock('@/lib/group', () => ({
  getAll: async () => mockGetAll()
}))

const mockError = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockError()
}))

describe('src/route/groups', () => {
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

    mockGetAll.mockReset()

    mockError.mockReset()

    req = {
      method: 'GET'
    }
    response = undefined
  })

  it('no session', async () => {
    await groups(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGetAll).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toBe(undefined)
  })

  it('GET', async () => {
    req.method = 'GET'

    mockSession.mockImplementation(() => 'id')
    mockGetAll.mockImplementation(() => [
      {
        id: 'id'
      }
    ])

    await groups(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGetAll).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ groups: [{ id: 'id' }] })

    // Error
    mockGetAll.mockImplementation(() => {
      throw new Error('test')
    })
    await groups(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockGetAll).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  it('wrong method', async () => {
    req.method = 'SOMETHING'

    mockSession.mockImplementation(() => true)

    await groups(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGetAll).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      error: true,
      message: 'Method SOMETHING not allowed'
    })
  })
})
