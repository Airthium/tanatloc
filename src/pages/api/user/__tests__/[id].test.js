import user from '@/pages/api/user/[id]'

jest.mock('@/route/user/[id]', () => () => {})

describe('src/pages/api/user/[id]', () => {
  it('call', async () => {
    await user()
  })
})
