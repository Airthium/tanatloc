import project from '@/pages/api/project'

jest.mock('@/route/project', () => jest.fn())

describe('pages/api/project', () => {
  test('call', async () => {
    await project()
  })
})
