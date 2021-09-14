import plugins from '@/pages/api/plugins'

jest.mock('@/route/plugins', () => jest.fn())

describe('pages/api/plugins', () => {
  test('call', async () => {
    await plugins()
  })
})
