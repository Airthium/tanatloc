import { Request, Response } from 'express'

import user from '@/pages/api/user'

jest.mock('@/route/user', () => jest.fn())

describe('pages/api/user', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await user(req, res)
  })
})