import GetByUserId from '../getByUserId'
import getByUserId from '../getByUserId'

jest.mock('../../', () => {
  return async (query) => {
    if (query.includes('SELECT workspaces'))
      return { rows: [{ workspaces: ['id'] }] }
    return {
      rows: [
        {
          name: 'name',
          owners: ['owner'],
          users: ['user'],
          projects: ['projects']
        }
      ]
    }
  }
})

describe('src/database/query/workspace', () => {
  it('getByUserId', async () => {
    const res = await getByUserId()
    expect(res).toEqual([
      {
        id: 'id',
        name: 'name',
        owners: ['owner'],
        users: ['user'],
        projects: ['projects']
      }
    ])
  })
})
