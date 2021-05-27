import user from '@/pages/api/user/[id]'

jest.mock('@/route/user/[id]', () => jest.fn())

describe('pages/api/user/[id]', () => {
  test('call', async () => {
    await user()
  })
})
