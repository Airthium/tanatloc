import avatar from '../'

let mockSession = () => false
jest.mock('../../session', () => () => mockSession())

let mockAdd = () => 'avatar'
let mockDel = () => {}
jest.mock('../../../lib/avatar', () => {
  return {
    add: async () => mockAdd(),
    del: async () => mockDel()
  }
})

jest.mock('../../../lib/sentry', () => ({
  captureException: () => {}
}))

describe('src/route/avatar', () => {
  const req = {
    method: 'POST',
    body: {}
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

  it('no session', async () => {
    await avatar(req, res)
    expect(response).toBe(undefined)
  })

  it('session (POST)', async () => {
    mockSession = () => true

    await avatar(req, res)
    expect(response).toBe('avatar')

    mockAdd = () => {
      throw new Error()
    }
    await avatar(req, res)
    expect(response).toEqual({ message: '' })
  })

  it('DELETE', async () => {
    req.method = 'DELETE'

    await avatar(req, res)
    expect(response).toBe('end')

    mockDel = () => {
      throw new Error()
    }
    await avatar(req, res)
    expect(response).toEqual({ message: '' })
  })

  it('bad method', async () => {
    req.method = 'SOMETHING'
    await avatar(req, res)
    expect(response).toEqual({ message: 'Method SOMETHING not allowed' })
  })
})
