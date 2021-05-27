import users from '@/pages/api/users'

jest.mock('@/route/users', () => jest.fn())

describe('pages/api/users', () => {
  test('call', async () => {
    await users()
  })
})
