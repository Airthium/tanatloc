import route from '@/pages/api/organization'

jest.mock('@/route/organization', () => jest.fn())

describe('pages/api/organization', () => {
  test('call', async () => {
    await route()
  })
})
