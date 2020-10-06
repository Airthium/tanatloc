import ids from '../[ids]'

let mockSession = () => false
jest.mock('../../session', () => () => mockSession())

let mockGet
jest.mock('../../../lib/project', () => {
  return {
    get: async () => mockGet()
  }
})

jest.mock('../../../lib/sentry', () => ({
  captureException: () => {}
}))

describe('src/route/projects/ids', () => {
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
      title: 'title'
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
      projects: [{ title: 'title' }, { title: 'title' }]
    })

    // Get error
    mockGet = () => {
      throw new Error()
    }
    await ids(req, res)
    expect(response).toEqual({
      projects: []
    })

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
      projects: [{ title: 'title' }, { title: 'title' }]
    })
  })

  it('wrong route', async () => {
    req.method = 'SOMETHING'
    await ids(req, res)
    expect(response).toEqual({ message: 'Method SOMETHING not allowed' })
  })
})
