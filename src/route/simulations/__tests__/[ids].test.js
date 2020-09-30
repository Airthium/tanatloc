import ids from '../[ids]'

let mockSession = () => false
jest.mock('../../session', () => () => mockSession())

let mockGet
jest.mock('../../../lib/simulation', () => {
  return {
    get: async () => mockGet()
  }
})

jest.mock('../../../lib/sentry', () => ({
  captureException: () => {}
}))

describe('src/route/simulations/ids', () => {
  const req = {
    method: 'GET',
    query: {},
    params: {}
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
    mockGet = () => ({
      name: 'name'
    })
  })

  it('no session', async () => {
    await ids(req, res)
    expect(response).toBe(undefined)
  })

  it('GET', async () => {
    mockSession = () => true

    // No ids
    req.query = { ids: 'undefined' }
    await ids(req, res)
    expect(response).toBe('end')

    // Normal
    req.query = { ids: 'id1&id2' }
    await ids(req, res)
    expect(response).toEqual({
      simulations: [{ name: 'name' }, { name: 'name' }]
    })

    // Get error
    mockGet = () => {
      throw new Error()
    }
    await ids(req, res)
    expect(response).toEqual({ simulations: [] })

    // Error
    req.query = undefined
    await ids(req, res)
    expect(response).toEqual({
      message: "Cannot read property 'ids' of undefined"
    })
  })

  it('electron', async () => {
    mockSession = () => true
    req.query = {}
    req.params = { ids: 'id1&id2' }
    await ids(req, res)
    expect(response).toEqual({
      simulations: [{ name: 'name' }, { name: 'name' }]
    })
  })

  it('wrong method', async () => {
    mockSession = () => true
    req.method = 'POST'
    await ids(req, res)
    expect(response).toEqual({ message: 'Method POST not allowed' })
  })
})
