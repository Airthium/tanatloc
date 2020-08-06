import workspace from '../../../pages/api/workspace'

let mockSession = () => ({})
jest.mock('../../../../src/auth/iron', () => ({
  getSession: () => mockSession()
}))

jest.mock(
  '../../../../src/database/query/workspace/getByUserId',
  () => async () => [
    {
      name: 'name',
      owners: ['owner']
    }
  ]
)

describe('pages/api/workspace', () => {
  const req = {}
  let response
  const res = {
    status: () => ({
      json: (obj) => {
        response = obj
      }
    })
  }

  it('no session', async () => {
    await workspace(req, res)
    expect(response).toEqual({ message: 'Unauthorized' })
  })

  it('session', async () => {
    mockSession = () => ({ id: 'id' })
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
})
