import geometry from '../'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockAdd = jest.fn()
jest.mock('@/lib/geometry', () => ({
  add: async () => mockAdd()
}))

const mockError = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockError()
}))

describe('route/geometry', () => {
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
    mockAdd.mockImplementation(() => ({
      id: 'id',
      name: 'name'
    }))

    mockError.mockReset()

    req = {
      method: 'GET'
    }
    response = undefined
  })

  test('no session', async () => {
    await geometry(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toBe(undefined)
  })

  test('GET', async () => {
    mockSession.mockImplementation(() => 'id')

    await geometry(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toBe('end')
  })

  test('POST', async () => {
    req.method = 'POST'

    mockSession.mockImplementation(() => 'id')

    await geometry(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({
      id: 'id',
      name: 'name'
    })

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error('test')
    })
    await geometry(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  test('wrong method', async () => {
    req.method = 'SOMETHING'

    mockSession.mockImplementation(() => true)

    await geometry(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      error: true,
      message: 'Method SOMETHING not allowed'
    })
  })
})
