import id from '@/pages/api/simulation/[id]'

jest.mock('@/route/simulation/[id]', () => jest.fn())

describe('pages/api/simulation/[id]', () => {
  test('call', async () => {
    await id()
  })
})
