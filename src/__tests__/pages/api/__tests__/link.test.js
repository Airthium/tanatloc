import link from '@/pages/api/link'

jest.mock('@/route/link', () => jest.fn())

describe('pages/api/link', () => {
  test('call', async () => {
    await link()
  })
})
