import workspace from '..'

let mockSession = () => false
jest.mock('../../session', () => () => mockSession())

jest.mock('../../../lib/workspace', () => {
  let countG = 0
  let countA = 0
  let countU = 0
  let countD = 0
  return {
    getByUser: async () => {
      countG++
      if (countG === 1) throw new Error('test')
      return [
        {
          name: 'name',
          owners: ['owner']
        }
      ]
    },
    add: async () => {
      countA++
      if (countA === 1) throw new Error('test')
      return { id: 'id' }
    },
    update: async () => {
      countU++
      if (countU === 1) throw new Error('test')
    },
    del: async () => {
      countD++
      if (countD === 1) throw new Error('test')
    }
  }
})

jest.mock('../../../lib/sentry', () => ({
  captureException: () => {}
}))

describe('pages/api/workspace', () => {
  const req = {
    method: 'GET'
  }
  let response
  const res = {
    status: () => ({
      json: (obj) => {
        response = obj
      },
      end: () => {
        response = null
      }
    })
  }

  it('no session', async () => {
    await workspace(req, res)
    expect(response).toBe(undefined)
  })

  it('GET', async () => {
    mockSession = () => true

    await workspace(req, res)
    expect(response).toEqual({ message: 'test' })

    await workspace(req, res)
    expect(response).toEqual({
      workspaces: [
        {
          name: 'name',
          owners: ['owner']
        }
      ]
    })
  })

  it('POST', async () => {
    req.method = 'POST'

    // Error
    await workspace(req, res)
    expect(response).toEqual({ message: 'test' })

    // Normal
    await workspace(req, res)
    expect(response).toEqual({ id: 'id' })
  })

  it('PUT', async () => {
    req.method = 'PUT'

    // Error
    await workspace(req, res)
    expect(response).toEqual({ message: 'test' })

    // Normal
    await workspace(req, res)
    expect(response).toBe(null)
  })

  it('DELETE', async () => {
    req.method = 'DELETE'

    // Error
    await workspace(req, res)
    expect(response).toEqual({ message: 'test' })

    // Normal
    await workspace(req, res)
    expect(response).toBe(null)
  })

  it('DEFAULT', async () => {
    req.method = 'DEFAULT'

    await workspace(req, res)
    expect(response).toEqual({ message: 'Method DEFAULT not allowed' })
  })
})
