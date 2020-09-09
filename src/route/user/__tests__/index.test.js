import user from '..'

let mockSession = () => false
jest.mock('../../session', () => () => mockSession())

let mockAdd
let mockGet
let mockUpdate
let mockDel
jest.mock('../../../lib/user', () => ({
  add: () => mockAdd(),
  get: () => mockGet(),
  update: () => mockUpdate(),
  del: () => mockDel()
}))

describe('src/route/user', () => {
  const req = {
    method: 'GET'
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
    response = null
    mockAdd = async () => {}
    mockGet = async () => ({
      username: 'username'
    })
    mockUpdate = async () => {}
    mockDel = async () => {}
  })

  it('no session', async () => {
    mockSession = () => false
    await user(req, res)
    expect(response).toBe(null)
  })

  it('session', async () => {
    mockSession = () => true
    await user(req, res)
    expect(response).toEqual({
      user: {
        username: 'username'
      }
    })
  })

  it('get error', async () => {
    mockGet = () => {
      throw new Error()
    }
    await user(req, res)
    expect(response).toEqual({ message: '' })
  })

  it('post', async () => {
    req.method = 'POST'
    await user(req, res)
    expect(response).toEqual({ user: undefined })
  })

  it('post error', async () => {
    mockAdd = () => {
      throw new Error()
    }
    await user(req, res)
    expect(response).toEqual({ message: '' })
  })

  it('put', async () => {
    req.method = 'PUT'
    await user(req, res)
    expect(response).toBe('end')
  })

  it('put error', async () => {
    mockUpdate = () => {
      throw new Error()
    }
    await user(req, res)
    expect(response).toEqual({ message: '' })
  })

  it('delete', async () => {
    req.method = 'DELETE'
    await user(req, res)
    expect(response).toBe('end')
  })

  it('delete error', async () => {
    mockDel = () => {
      throw new Error()
    }
    await user(req, res)
    expect(response).toEqual({ message: '' })
  })

  it('wrong method', async () => {
    req.method = 'unknown'
    await user(req, res)
    expect(response).toEqual({ message: 'Method unknown not allowed' })
  })
})
