import id from '@/pages/api/project/[id]'

jest.mock('@/route/project/[id]', () => jest.fn())

describe('pages/api/project/[id]', () => {
  test('call', async () => {
    await id()
  })
})
