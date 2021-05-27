import groups from '@/pages/api/groups'

jest.mock('@/route/groups', () => jest.fn())

describe('pages/api/groups', () => {
  test('call', async () => {
    await groups()
  })
})
