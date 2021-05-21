import user from '@/pages/api/user'

jest.mock('@/route/user', () => jest.fn())

describe('pages/api/user', () => {
  it('call', async () => {
    await user()
  })
})
