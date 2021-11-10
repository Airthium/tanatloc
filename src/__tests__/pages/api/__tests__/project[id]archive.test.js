import archive from '@/pages/api/project/[id]/archive'

jest.mock('@/route/project/[id]/archive', () => jest.fn())

describe('pages/api/project/[id]/archive', () => {
  test('call', async () => {
    await archive()
  })
})
