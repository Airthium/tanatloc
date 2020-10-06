import id from '../[id]'

let mockSession = () => false
jest.mock('../../session', () => () => mockSession())

let mockGet
let mockUpdate
let mockDel
jest.mock('../../../lib/simulation', () => {
  return {
    get: async () => mockGet(),
    update: async () => mockUpdate(),
    del: () => mockDel()
  }
})

jest.mock('../../../lib/sentry', () => ({
  captureException: () => {}
}))

describe('src/route/simulation/[id]', () => {
  const req = {
    method: 'GET',
    query: { id: 'id' }
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
    mockUpdate = () => {}
    mockDel = () => {}
  })

  it('no session', async () => {
    await id(req, res)
    expect(response).toBe(undefined)
  })

  it('GET', async () => {
    mockSession = () => true

    await id(req, res)
    expect(response).toEqual({
      simulation: {
        name: 'name'
      }
    })

    // Error
    mockGet = () => {
      throw new Error()
    }
    await id(req, res)
    expect(response).toEqual({ message: '' })
  })

  it('electron', async () => {
    mockSession = () => true
    req.query.id = undefined
    req.params = { id: 'id' }
    await id(req, res)
    expect(response).toEqual({
      simulation: {
        name: 'name'
      }
    })
  })

  it('wrong method', async () => {
    mockSession = () => true
    req.method = 'POST'
    await id(req, res)
    expect(response).toEqual({ message: 'Method POST not allowed' })
  })

  it('PUT', async () => {
    mockSession = () => true
    req.method = 'PUT'

    await id(req, res)
    expect(response).toBe('end')

    // Error
    mockUpdate = () => {
      throw new Error()
    }
    await id(req, res)
    expect(response).toEqual({ message: '' })
  })

  it('DELETE', async () => {
    mockSession = () => true
    req.method = 'DELETE'

    await id(req, res)
    expect(response).toBe('end')

    // Error
    mockDel = () => {
      throw new Error()
    }
    await id(req, res)
    expect(response).toEqual({ message: '' })
  })
})
