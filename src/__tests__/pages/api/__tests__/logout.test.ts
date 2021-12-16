import { Request, Response } from 'express'

import logout from '@/pages/api/logout'

jest.mock('@/route/logout', () => ({
  logout: jest.fn()
}))

describe('pages/api/logout', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await logout(req, res)
  })
})
