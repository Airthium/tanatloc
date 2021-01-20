import login from '@/pages/api/login'

jest.mock('@/route/login', () => () => {})

describe('pages/api/login', () => {
  it('call', async () => {
    await login()
  })
})
