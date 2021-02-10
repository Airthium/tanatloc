import user from '@/pages/api/user/check'

jest.mock('@/route/user/check', () => () => {})

describe('src/pages/api/user/check', () => {
  it('call', async () => {
    await user()
  })
})
