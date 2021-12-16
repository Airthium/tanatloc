import { Request, Response } from 'express'

import user from '@/pages/api/user/[id]'

jest.mock('@/route/user/[id]', () => jest.fn())

describe('pages/api/user/[id]', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await user(
      //@ts-ignore
      req,
      res
    )
  })
})
