import system from '@/pages/api/system'

jest.mock('@/route/system', () => () => {})

describe('pages/api/system', () => {
  it('call', async () => {
    await system()
  })
})
