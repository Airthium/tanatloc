import { Request, Response } from 'express'

import user from '@/pages/api/user/check'

jest.mock('@/route/user/check', () => jest.fn())

describe('pages/api/user/check', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await user(req, res)
  })
})
