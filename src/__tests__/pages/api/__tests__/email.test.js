import email from '@/pages/api/email'

jest.mock('@/route/email', () => jest.fn())

describe('pages/api/email', () => {
  test('call', async () => {
    await email()
  })
})
