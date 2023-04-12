import { Request, Response } from 'express'

import user from '../[id]'

jest.mock('@/route/user/[id]', () => jest.fn())

describe('pages/api/user/[id]', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await user(req, res)
  })
})
