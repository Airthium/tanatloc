import plugin from '@/pages/api/plugin'

jest.mock('@/route/plugin', () => () => {})

describe('pages/api/plugin', () => {
  it('call', async () => {
    await plugin()
  })
})
