import id from '../[id]'

let mockSession = () => false
jest.mock('../../session', () => () => mockSession())

jest.mock('../../../lib/project', () => {
  let countG = 0
  let countU = 0
  let countD = 0
  return {
    get: async () => {
      countG++
      if (countG === 1) throw new Error()
      return {
        title: 'title'
      }
    },
    update: async () => {
      countU++
      if (countU === 1) throw new Error()
    },
    del: () => {
      countD++
      if (countD === 1) throw new Error()
    }
  }
})

jest.mock('../../../lib/sentry', () => ({
  captureException: () => {}
}))

describe('src/route/project/[id]', () => {
  const req = {
    method: 'GET',
    query: { id: 'id' }
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
    await id(req, res)
    expect(response).toBe(undefined)
  })

  it('session', async () => {
    mockSession = () => true

    await id(req, res)
    expect(response).toEqual({ message: '' })

    await id(req, res)
    expect(response).toEqual({
      project: {
        title: 'title'
      }
    })
  })

  it('electron', async () => {
    mockSession = () => true
    req.query.id = undefined
    req.params = { id: 'id' }
    await id(req, res)
    expect(response).toEqual({
      project: {
        title: 'title'
      }
    })
  })

  it('POST', async () => {
    mockSession = () => true
    req.method = 'POST'
    await id(req, res)
    expect(response).toEqual({ message: 'Method POST not allowed' })
  })

  it('PUT', async () => {
    mockSession = () => true
    req.method = 'PUT'

    await id(req, res)
    expect(response).toEqual({ message: '' })

    await id(req, res)
    expect(response).toBe('end')
  })

  it('DELETE', async () => {
    mockSession = () => true
    req.method = 'DELETE'

    await id(req, res)
    expect(response).toEqual({ message: '' })

    await id(req, res)
    expect(response).toBe('end')
  })
})
