import logout from '@/pages/api/logout'

jest.mock('@/route/logout', () => () => {})

describe('pages/api/logout', () => {
  test('call', async () => {
    await logout()
  })
})
