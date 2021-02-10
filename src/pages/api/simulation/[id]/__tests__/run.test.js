import run from '@/pages/api/simulation/[id]/run'

jest.mock('@/route/simulation/[id]/run', () => () => {})

describe('pages/api/simulation/[id]/run', () => {
  it('call', async () => {
    await run()
  })
})
