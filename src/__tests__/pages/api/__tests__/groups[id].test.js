import id from '@/pages/api/groups/[id]'

jest.mock('@/route/groups/[id]', () => jest.fn())

describe('pages/api/groups/[id]', () => {
  test('call', async () => {
    await id()
  })
})
