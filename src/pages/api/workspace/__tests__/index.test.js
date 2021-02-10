import workspace from '@/pages/api/workspace'

jest.mock('@/route/workspace', () => () => {})

describe('pages/api/workspace', () => {
  it('call', async () => {
    await workspace()
  })
})
