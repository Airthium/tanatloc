import stop from '@/pages/api/simulation/[id]/stop'

jest.mock('@/route/simulation/[id]/stop', () => () => {})

describe('pages/api/simulation/[id]/stop', () => {
  test('call', async () => {
    await stop()
  })
})
