import ids from '../[ids]'

let mockSession = () => false
jest.mock('../../session', () => () => mockSession())

jest.mock('../../../lib/project', () => {
  let countG = 0
  return {
    get: async () => {
      countG++
      if (countG === 1) throw new Error()
      return {
        title: 'title'
      }
    }
  }
})

jest.mock('../../../lib/sentry', () => ({
  captureException: () => {}
}))

describe('src/route/projects/ids', () => {
  const req = {
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

  it('no session', async () => {
    await ids(req, res)
    expect(response).toBe(undefined)
  })

  it('session', async () => {
    mockSession = () => true

    // No ids
    req.query = { ids: 'undefined' }
    await ids(req, res)
    expect(response).toBe('end')

    // Normal
    req.query = { ids: 'id1&id2' }
    await ids(req, res)
    expect(response).toEqual({ projects: [{ title: 'title' }] })

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
})
