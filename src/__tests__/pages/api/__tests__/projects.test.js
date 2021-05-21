import id from '@/pages/api/projects'

jest.mock('@/route/projects', () => jest.fn())

describe('pages/api/project', () => {
  it('call', async () => {
    await id()
  })
})
