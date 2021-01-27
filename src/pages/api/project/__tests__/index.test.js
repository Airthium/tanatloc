import project from '@/pages/api/project'

jest.mock('@/route/project', () => () => {})

describe('pages/api/project', () => {
  it('call', async () => {
    await project()
  })
})
