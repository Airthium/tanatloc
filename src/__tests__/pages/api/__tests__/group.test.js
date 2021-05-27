import group from '@/pages/api/group'

jest.mock('@/route/group', () => jest.fn())

describe('pages/api/group', () => {
  test('call', async () => {
    await group()
  })
})
