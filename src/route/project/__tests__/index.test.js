import project from '../'

let mockSession = () => false
jest.mock('../../session', () => () => mockSession())

let mockAdd
jest.mock('../../../lib/project', () => {
  return {
    add: async () => mockAdd()
  }
})

jest.mock('../../../lib/sentry', () => ({
  captureException: () => {}
}))

describe('src/route/project', () => {
  const req = {
    method: 'POST',
    body: { title: 'title' }
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
    mockAdd = () => ({
      id: 'id'
    })
  })

  it('no session', async () => {
    await project(req, res)
    expect(response).toBe(undefined)
  })

  it('session', async () => {
    mockSession = () => true

    await project(req, res)
    expect(response).toEqual({
      id: 'id'
    })

    // Error
    mockAdd = () => {
      throw new Error()
    }
    await project(req, res)
    expect(response).toEqual({ message: '' })
  })

  it('get', async () => {
    req.method = 'GET'
    await project(req, res)
    expect(response).toBe('end')
  })

  it('bad method', async () => {
    req.method = 'OTHER'
    await project(req, res)
    expect(response).toEqual({ message: 'Method OTHER not allowed' })
  })
})
