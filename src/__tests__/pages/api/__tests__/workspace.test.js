import workspace from '@/pages/api/workspace'

jest.mock('@/route/workspace', () => jest.fn())

describe('pages/api/workspace', () => {
  it('call', async () => {
    await workspace()
  })
})
