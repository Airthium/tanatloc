import run from '@/pages/api/simulation/[id]/run'

jest.mock('@/route/simulation/[id]/run', () => () => {})

describe('pages/api/simulation/[id]/run', () => {
  test('call', async () => {
    await run()
  })
})
