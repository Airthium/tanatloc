import id from '../[id]'

let mockSession = () => false
jest.mock('../../session', () => () => mockSession())

let mockGet
let mockUpdate
let mockDel
jest.mock('../../../lib/project', () => {
  return {
    get: async () => mockGet(),
    update: async () => mockUpdate(),
    del: async () => mockDel()
  }
})

jest.mock('../../../lib/sentry', () => ({
  captureException: () => {}
}))

describe('src/route/project/[id]', () => {
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
      title: 'title'
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
      project: {
        title: 'title'
      }
    })

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
      project: {
        title: 'title'
      }
    })
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

  it('Wrong route', async () => {
    mockSession = () => true
    req.method = 'POST'
    await id(req, res)
    expect(response).toEqual({ message: 'Method POST not allowed' })
  })
})
