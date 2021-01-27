import id from '@/pages/api/projects/[ids]'

jest.mock('@/route/projects/[ids]', () => () => {})

describe('pages/api/project/[id]', () => {
  it('call', async () => {
    await id()
  })
})
