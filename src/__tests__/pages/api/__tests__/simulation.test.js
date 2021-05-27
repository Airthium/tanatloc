import simulation from '@/pages/api/simulation'

jest.mock('@/route/simulation', () => jest.fn())

describe('pages/api/simulation', () => {
  test('call', async () => {
    await simulation()
  })
})
