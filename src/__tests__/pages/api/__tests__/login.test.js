import login from '@/pages/api/login'

jest.mock('@/route/login', () => jest.fn())

describe('pages/api/login', () => {
  it('call', async () => {
    await login()
  })
})
