import project from '@/pages/api/projects'

jest.mock('@/route/projects', () => () => {})

describe('pages/api/projects', () => {
  it('call', async () => {
    await project()
  })
})
