import avatar from '../'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockAdd = jest.fn()
const mockDel = jest.fn()
jest.mock('../../../lib/avatar', () => ({
  add: async () => mockAdd(),
  del: async () => mockDel()
}))

const mockSentry = jest.fn()
jest.mock('../../../lib/sentry', () => ({
  captureException: () => mockSentry()
}))

describe('src/route/avatar', () => {
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

    mockSentry.mockReset()

    req = {
      method: 'POST',
      body: {}
    }
    response = undefined
  })

  it('no session', async () => {
    await avatar(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(0)
    expect(response).toBe(undefined)
  })

  it('POST', async () => {
    mockSession.mockImplementation(() => true)

    await avatar(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(0)
    expect(response).toBe('avatar')

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error('test')
    })
    await avatar(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ message: 'test' })
  })

  it('DELETE', async () => {
    req.method = 'DELETE'

    mockSession.mockImplementation(() => true)

    await avatar(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockSentry).toHaveBeenCalledTimes(0)
    expect(response).toBe('end')

    // Error
    mockDel.mockImplementation(() => {
      throw new Error('test')
    })
    await avatar(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(mockSentry).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ message: 'test' })
  })

  it('wrong method', async () => {
    req.method = 'SOMETHING'

    mockSession.mockImplementation(() => true)

    await avatar(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ message: 'Method SOMETHING not allowed' })
  })
})
