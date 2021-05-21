import users from '@/pages/api/users'

jest.mock('@/route/users', () => jest.fn())

describe('pages/api/users', () => {
  it('call', async () => {
    await users()
  })
})
