import file from '../'

let mockSession = () => false
jest.mock('../../session', () => () => mockSession())

let mockGet = () => 'file'
jest.mock('../../../lib/file', () => {
  return {
    get: async () => mockGet()
  }
})

jest.mock('../../../lib/sentry', () => ({
  captureException: () => {}
}))

describe('src/route/file', () => {
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
    await file(req, res)
    expect(response).toBe(undefined)
  })

  it('session (POST)', async () => {
    mockSession = () => true

    await file(req, res)
    expect(response).toBe('file')

    // Error
    mockGet = () => {
      throw new Error()
    }
    await file(req, res)
    expect(response).toEqual({ message: '' })
  })

  it('bad method', async () => {
    req.method = 'SOMETHING'
    await file(req, res)
    expect(response).toEqual({ message: 'Method SOMETHING not allowed' })
  })
})
