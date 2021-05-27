import groups from '../[id]'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockGetByOrganization = jest.fn()
jest.mock('@/lib/group', () => ({
  getByOrganization: async () => mockGetByOrganization()
}))

const mockError = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockError()
}))

describe('route/groups/[id]', () => {
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

    mockGetByOrganization.mockReset()

    mockError.mockReset()

    req = {
      method: 'GET',
      query: { id: 'id' }
    }
    response = undefined
  })

  test('no session', async () => {
    await groups(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGetByOrganization).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toBe(undefined)
  })

  test('GET', async () => {
    req.method = 'GET'

    mockSession.mockImplementation(() => 'id')
    mockGetByOrganization.mockImplementation(() => [
      {
        id: 'id'
      }
    ])

    await groups(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGetByOrganization).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ groups: [{ id: 'id' }] })

    // Error
    mockGetByOrganization.mockImplementation(() => {
      throw new Error('test')
    })
    await groups(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockGetByOrganization).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  test('electron', async () => {
    req.query.id = undefined
    req.params = { id: 'id' }

    mockSession.mockImplementation(() => 'id')
    mockGetByOrganization.mockImplementation(() => [
      {
        id: 'id'
      }
    ])

    await groups(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGetByOrganization).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ groups: [{ id: 'id' }] })
  })

  test('wrong method', async () => {
    req.method = 'SOMETHING'

    mockSession.mockImplementation(() => true)

    await groups(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGetByOrganization).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      error: true,
      message: 'Method SOMETHING not allowed'
    })
  })
})
