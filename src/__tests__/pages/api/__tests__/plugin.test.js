import plugin from '@/pages/api/plugin'

jest.mock('@/route/plugin', () => jest.fn())

describe('pages/api/plugin', () => {
  test('call', async () => {
    await plugin()
  })
})
