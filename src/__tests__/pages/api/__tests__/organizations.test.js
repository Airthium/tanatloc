import route from '@/pages/api/organizations'

jest.mock('@/route/organizations', () => jest.fn())

describe('pages/api/organizations', () => {
  it('call', async () => {
    await route()
  })
})
