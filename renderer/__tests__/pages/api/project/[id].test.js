import id from '../../../../pages/api/project/[id]'

let mockSession = () => ({})
jest.mock('../../../../../src/auth/iron', () => ({
  getSession: () => mockSession()
}))

jest.mock('../../../../../src/database/project', () => {
  let count = 0
  return {
    getById: async () => {
      count++
      if (count === 1) throw new Error()
      return {
        title: 'title',
        description: 'description',
        avatar: 'avatar',
        owners: ['id1'],
        users: ['id2']
      }
    }
  }
})

describe('pages/api/project/[id]', () => {
  const req = {
    method: 'GET',
    query: { id: 'id' }
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
    await id(req, res)
    expect(response).toEqual({ message: 'Unauthorized' })
  })

  it('session', async () => {
    mockSession = () => ({ id: 'id' })

    await id(req, res)
    expect(response).toEqual({ message: '' })

    await id(req, res)
    expect(response).toEqual({
      project: {
        title: 'title',
        description: 'description',
        avatar: 'avatar',
        owners: ['id1'],
        users: ['id2']
      }
    })
  })

  it('bad method', async () => {
    mockSession = () => ({ id: 'id' })
    req.method = 'POST'
    await id(req, res)
    expect(response).toEqual({ message: 'Method POST not allowed' })
  })
})
