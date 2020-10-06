import part from '../'

let mockSession = () => false
jest.mock('../../session', () => () => mockSession())

let mockGet = () => 'part'
jest.mock('../../../lib/part', () => {
  return {
    get: async () => mockGet()
  }
})

jest.mock('../../../lib/sentry', () => ({
  captureException: () => {}
}))

describe('src/route/part', () => {
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
    await part(req, res)
    expect(response).toBe(undefined)
  })

  it('session (POST)', async () => {
    mockSession = () => true

    await part(req, res)
    expect(response).toBe('part')

    // Error
    mockGet = () => {
      throw new Error()
    }
    await part(req, res)
    expect(response).toEqual({ message: '' })
  })

  it('bad method', async () => {
    req.method = 'SOMETHING'
    await part(req, res)
    expect(response).toEqual({ message: 'Method SOMETHING not allowed' })
  })
})
