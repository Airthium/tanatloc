import route from '@/pages/api/organizations'

jest.mock('@/route/organizations', () => () => {})

describe('pages/api/organizations', () => {
  it('call', async () => {
    await route()
  })
})
