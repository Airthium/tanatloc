import route from '@/pages/api/organizations'

jest.mock('@/route/organizations', () => jest.fn())

describe('pages/api/organizations', () => {
  test('call', async () => {
    await route()
  })
})
