import project from '../'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockAdd = jest.fn()
jest.mock('@/lib/project', () => ({
  add: async () => mockAdd()
}))

const mockError = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockError()
}))

describe('route/project', () => {
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
      title: 'title'
    }))

    mockError.mockReset()

    req = {
      method: 'GET'
    }
    response = undefined
  })

  it('no session', async () => {
    await project(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toBe(undefined)
  })

  it('GET', async () => {
    mockSession.mockImplementation(() => true)

    await project(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toBe('end')
  })

  it('POST', async () => {
    req.method = 'POST'

    mockSession.mockImplementation(() => true)

    await project(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({
      id: 'id',
      title: 'title'
    })

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error('test')
    })
    await project(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  it('wrong method', async () => {
    req.method = 'SOMETHING'

    mockSession.mockImplementation(() => true)

    await project(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      error: true,
      message: 'Method SOMETHING not allowed'
    })
  })
})
