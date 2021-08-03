import avatar from '../'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockAdd = jest.fn()
const mockDel = jest.fn()
jest.mock('@/lib/avatar', () => ({
  add: async () => mockAdd(),
  del: async () => mockDel()
}))

const mockError = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockError()
}))

describe('route/avatar', () => {
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

    mockAdd.mockReset()
    mockAdd.mockImplementation(() => 'avatar')
    mockDel.mockReset()

    mockError.mockReset()

    req = {
      method: 'POST',
      body: {}
    }
    response = undefined
  })

  test('no session', async () => {
    await avatar(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toBe(undefined)
  })

  test('POST', async () => {
    mockSession.mockImplementation(() => true)

    // Empty body
    await avatar(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { ?project: { id(uuid) }, file: { name(string), uid(uuid), data(string) } })'
    })

    // With body
    req.body = {
      file: {
        name: 'name',
        uid: 'uid',
        data: 'data'
      }
    }
    await avatar(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toBe('avatar')

    // With project
    req.body.project = {
      id: 'id'
    }
    await avatar(req, res)
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toBe('avatar')

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error('test')
    })
    await avatar(req, res)
    expect(mockSession).toHaveBeenCalledTimes(4)
    expect(mockAdd).toHaveBeenCalledTimes(3)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  test('wrong method', async () => {
    req.method = 'SOMETHING'

    mockSession.mockImplementation(() => true)

    await avatar(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      error: true,
      message: 'Method SOMETHING not allowed'
    })
  })
})
