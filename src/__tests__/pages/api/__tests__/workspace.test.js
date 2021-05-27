import workspace from '@/pages/api/workspace'

jest.mock('@/route/workspace', () => jest.fn())

describe('pages/api/workspace', () => {
  test('call', async () => {
    await workspace()
  })
})
