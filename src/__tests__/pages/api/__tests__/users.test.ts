import { Request, Response } from 'express'

import users from '@/pages/api/users'

jest.mock('@/route/users', () => jest.fn())

describe('pages/api/users', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await users(req, res)
  })
})
