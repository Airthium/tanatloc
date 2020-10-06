import simulation from '../'

let mockSession = () => false
jest.mock('../../session', () => () => mockSession())

let mockAdd
jest.mock('../../../lib/simulation', () => {
  return {
    add: async () => mockAdd()
  }
})

jest.mock('../../../lib/sentry', () => ({
  captureException: () => {}
}))

describe('src/route/simulation', () => {
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
    await simulation(req, res)
    expect(response).toBe(undefined)
  })

  it('POST', async () => {
    mockSession = () => true

    await simulation(req, res)
    expect(response).toEqual({
      id: 'id'
    })

    // Error
    mockAdd = () => {
      throw new Error()
    }
    await simulation(req, res)
    expect(response).toEqual({ message: '' })
  })

  it('GET', async () => {
    req.method = 'GET'
    await simulation(req, res)
    expect(response).toBe('end')
  })

  it('bad method', async () => {
    req.method = 'OTHER'
    await simulation(req, res)
    expect(response).toEqual({ message: 'Method OTHER not allowed' })
  })
})
