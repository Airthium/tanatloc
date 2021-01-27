import user from '@/pages/api/user'

jest.mock('@/route/user', () => () => {})

describe('pages/api/user', () => {
  it('call', async () => {
    await user()
  })
})
