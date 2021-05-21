import id from '@/pages/api/project/[id]'

jest.mock('@/route/project/[id]', () => jest.fn())

describe('pages/api/project/[id]', () => {
  it('call', async () => {
    await id()
  })
})
