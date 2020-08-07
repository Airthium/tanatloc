import workspace from '../../../pages/api/workspace'

let mockSession = () => ({})
jest.mock('../../../../src/auth/iron', () => ({
  getSession: () => mockSession()
}))

jest.mock('../../../../src/database/query/workspace/getByUserId', () => {
  let count = 0
  return async () => {
    count++
    if (count === 1) throw new Error('test')
    return [
      {
        name: 'name',
        owners: ['owner']
      }
    ]
  }
})

jest.mock('../../../../src/database/query/workspace/add', () => {
  let count = 0
  return async () => {
    count++
    if (count === 1) throw new Error('test')
    return { id: 'id' }
  }
})

jest.mock('../../../../src/database/query/workspace/update', () => {
  let count = 0
  return async () => {
    count++
    if (count === 1) throw new Error('test')
  }
})

jest.mock('../../../../src/database/query/workspace/delete', () => {
  let count = 0
  return async () => {
    count++
    if (count === 1) throw new Error('test')
  }
})

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
    expect(response).toEqual({ message: 'Unauthorized' })
  })

  it('GET', async () => {
    mockSession = () => ({ id: 'id' })

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
    expect(response).toEqual({ workspace: { id: 'id' } })
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
