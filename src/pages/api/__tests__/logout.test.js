import logout from '@/pages/api/logout'

jest.mock('@/route/logout', () => () => {})

describe('pages/api/logout', () => {
  it('call', async () => {
    await logout()
  })
})
