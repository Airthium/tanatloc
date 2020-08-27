import { get } from '../user'

jest.mock('../../database/user', () => {
  return {
    get: async () => ({
      id: 'id',
      username: 'username'
    })
  }
})

describe('src/lib/user', () => {
  it('get', async () => {
    const user = await get('id')
    expect(user).toEqual({ id: 'id', username: 'username' })
  })
})
