import { getByUsernameAndPassword } from '../getByUsernameAndPassword'

jest.mock('../..', () => ({
  query: async () => ({
    rows: [{ id: 'id' }]
  })
}))

describe('database/query/user/getByUsernameAndPassword', () => {
  test('call', async () => {
    const res = await getByUsernameAndPassword({
      email: 'email',
      password: 'password'
    })
    expect(res).toEqual({ id: 'id' })
  })
})
