import log from '@/pages/api/simulation/[id]/log'

jest.mock('@/route/simulation/[id]/log', () => () => {})

describe('pages/api/simulation/[id]/log', () => {
  test('call', async () => {
    await log()
  })
})
