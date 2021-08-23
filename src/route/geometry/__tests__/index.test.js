import geometry from '../'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockCheckProjectAuth = jest.fn()
jest.mock('../../auth', () => ({
  checkProjectAuth: async () => mockCheckProjectAuth()
}))

const mockError = jest.fn()
jest.mock('../../error', () => (status, message) => mockError(status, message))

const mockAdd = jest.fn()
jest.mock('@/lib/geometry', () => ({
  add: async () => mockAdd()
}))

describe('route/geometry', () => {
  const req = {}
  let resStatus
  let resJson
  const res = {
    status: (status) => {
      resStatus = status
      return {
        json: (obj) => {
          resJson = obj
        },
        end: () => {
          resJson = 'end'
        }
      }
    }
  }

  beforeEach(() => {
    mockSession.mockReset()
    mockSession.mockImplementation(() => false)

    mockCheckProjectAuth.mockReset()
    mockCheckProjectAuth.mockImplementation(() => true)

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockAdd.mockReset()
    mockAdd.mockImplementation(() => ({
      id: 'id',
      name: 'name'
    }))

    resStatus = undefined
    resJson = undefined
  })

  test('no session', async () => {
    mockSession.mockImplementation(() => {
      const error = new Error('Unauthorized')
      error.status = 401
      throw error
    })
    await geometry(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({ error: true, message: 'Unauthorized' })
  })

  // test('GET', async () => {
  //   mockSession.mockImplementation(() => 'id')

  //   await geometry(req, res)
  //   expect(mockSession).toHaveBeenCalledTimes(1)
  //   expect(mockAdd).toHaveBeenCalledTimes(0)
  //   expect(mockError).toHaveBeenCalledTimes(0)
  //   expect(response).toBe('end')
  // })

  // test('POST', async () => {
  //   req.method = 'POST'
  //   req.body = {
  //     project: { id: 'id' },
  //     geometry: {
  //       name: 'name',
  //       uid: 'uid',
  //       buffer: Buffer.from('buffer')
  //     }
  //   }

  //   mockSession.mockImplementation(() => 'id')

  //   await geometry(req, res)
  //   expect(mockSession).toHaveBeenCalledTimes(1)
  //   expect(mockAdd).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(0)
  //   expect(response).toEqual({
  //     id: 'id',
  //     name: 'name'
  //   })

  //   // Error
  //   mockAdd.mockImplementation(() => {
  //     throw new Error('test')
  //   })
  //   await geometry(req, res)
  //   expect(mockSession).toHaveBeenCalledTimes(2)
  //   expect(mockAdd).toHaveBeenCalledTimes(2)
  //   expect(mockError).toHaveBeenCalledTimes(1)
  //   expect(response).toEqual({ error: true, message: 'test' })
  // })

  test('wrong method', async () => {
    req.method = 'method'

    await geometry(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
