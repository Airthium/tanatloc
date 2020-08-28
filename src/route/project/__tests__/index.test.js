import project from '../'

let mockSession = () => false
jest.mock('../../session', () => () => mockSession())

jest.mock('../../../lib/project', () => {
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
      }
    })
  }

  it('no session', async () => {
    await project(req, res)
    expect(response).toBe(undefined)
  })

  it('session', async () => {
    mockSession = () => true

    await project(req, res)
    expect(response).toEqual({ message: '' })

    await project(req, res)
    expect(response).toEqual({
      id: 'id'
    })
  })

  it('bad method', async () => {
    req.method = 'GET'
    await project(req, res)
    expect(response).toEqual({ message: 'Method GET not allowed' })
  })
})
