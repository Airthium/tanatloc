import simulation from '../'

let mockSession = () => false
jest.mock('../../session', () => () => mockSession())

jest.mock('../../../lib/simulation', () => {
  let count = 0
  return {
    add: async () => {
      count++
      if (count === 1) throw new Error()
      return {
        id: 'id'
      }
    }
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

  it('no session', async () => {
    await simulation(req, res)
    expect(response).toBe(undefined)
  })

  it('session', async () => {
    mockSession = () => true

    await simulation(req, res)
    expect(response).toEqual({ message: '' })

    await simulation(req, res)
    expect(response).toEqual({
      id: 'id'
    })
  })

  it('get', async () => {
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
