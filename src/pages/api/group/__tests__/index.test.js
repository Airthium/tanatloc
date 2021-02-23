import group from '@/pages/api/group'

jest.mock('@/route/group', () => () => {})

describe('pages/api/group', () => {
  it('call', async () => {
    await group()
  })
})
