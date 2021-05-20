import id from '@/pages/api/projects'

jest.mock('@/route/projects', () => () => {})

describe('pages/api/project', () => {
  it('call', async () => {
    await id()
  })
})
