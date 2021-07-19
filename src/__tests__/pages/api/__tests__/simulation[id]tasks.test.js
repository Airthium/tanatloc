import tasks from '@/pages/api/simulation/[id]/tasks'

jest.mock('@/route/simulation/[id]/tasks', () => () => {})

describe('pages/api/simulation/[id]/tasks', () => {
  test('call', async () => {
    await tasks()
  })
})
