import simulation from '@/pages/api/simulation'

jest.mock('@/route/simulation', () => () => {})

describe('pages/api/simulation', () => {
  it('call', async () => {
    await simulation()
  })
})
