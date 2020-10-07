import workspace from '..'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockGetByUser = jest.fn()
const mockAdd = jest.fn()
const mockUpdate = jest.fn()
const mockDel = jest.fn()
jest.mock('../../../lib/workspace', () => {
  return {
    getByUser: async () => mockGetByUser(),
    // async () => {
    //   countG++
    //   if (countG === 1) throw new Error('test')
    //   return [
    //     {
    //       name: 'name',
    //       owners: ['owner']
    //     }
    //   ]
    // },
    add: async () => mockAdd(),
    // {
    //   countA++
    //   if (countA === 1) throw new Error('test')
    //   return { id: 'id' }
    // },
    update: async () => mockUpdate(),
    //   countU++
    //   if (countU === 1) throw new Error('test')
    // },
    del: async () => mockDel()
    //   countD++
    //   if (countD === 1) throw new Error('test')
    // }
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

  beforeEach(() => {
    mockSession.mockReset()
    mockSession.mockImplementation(() => false)

    mockGetByUser.mockReset()
    mockAdd.mockReset()
    mockUpdate.mockReset()
    mockDel.mockReset()
  })

  it('no session', async () => {
    await workspace(req, res)
    expect(response).toBe(undefined)
  })

  it('GET', async () => {
    mockSession.mockImplementation(() => true)

    mockGetByUser.mockImplementation(() => [
      {
        name: 'name',
        owners: ['owner']
      }
    ])
    await workspace(req, res)
    expect(response).toEqual({
      workspaces: [
        {
          name: 'name',
          owners: ['owner']
        }
      ]
    })

    // Error
    mockGetByUser.mockImplementation(() => {
      throw new Error('test')
    })
    await workspace(req, res)
    expect(response).toEqual({ message: 'test' })
  })

  it('POST', async () => {
    req.method = 'POST'

    mockSession.mockImplementation(() => true)

    mockAdd.mockImplementation(() => ({
      id: 'id'
    }))
    await workspace(req, res)
    expect(response).toEqual({ id: 'id' })

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error('test')
    })
    await workspace(req, res)
    expect(response).toEqual({ message: 'test' })
  })

  it('PUT', async () => {
    req.method = 'PUT'
    req.body = {}

    mockSession.mockImplementation(() => true)

    await workspace(req, res)
    expect(response).toBe(null)

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('test')
    })
    await workspace(req, res)
    expect(response).toEqual({ message: 'test' })
  })

  it('DELETE', async () => {
    req.method = 'DELETE'

    mockSession.mockImplementation(() => true)

    await workspace(req, res)
    expect(response).toBe(null)

    // Error
    mockDel.mockImplementation(() => {
      throw new Error('test')
    })
    await workspace(req, res)
    expect(response).toEqual({ message: 'test' })
  })

  it('DEFAULT', async () => {
    req.method = 'DEFAULT'

    mockSession.mockImplementation(() => true)

    await workspace(req, res)
    expect(response).toEqual({ message: 'Method DEFAULT not allowed' })
  })
})
