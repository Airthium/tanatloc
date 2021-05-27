import user from '@/pages/api/user/check'

jest.mock('@/route/user/check', () => jest.fn())

describe('pages/api/user/check', () => {
  test('call', async () => {
    await user()
  })
})
