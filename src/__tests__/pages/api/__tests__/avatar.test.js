import avatar from '@/pages/api/avatar'

jest.mock('@/route/avatar', () => jest.fn())

describe('pages/api/avatar', () => {
  it('call', async () => {
    await avatar()
  })
})
