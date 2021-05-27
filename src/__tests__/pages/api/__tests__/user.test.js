import user from '@/pages/api/user'

jest.mock('@/route/user', () => jest.fn())

describe('pages/api/user', () => {
  test('call', async () => {
    await user()
  })
})
