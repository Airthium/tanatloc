import { Request, Response } from 'express'

import avatar from '@/pages/api/avatar'

jest.mock('@/route/avatar', () => jest.fn())

describe('pages/api/avatar', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await avatar(req, res)
  })
})
