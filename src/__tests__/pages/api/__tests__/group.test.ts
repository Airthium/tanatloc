import { Request, Response } from 'express'

import group from '@/pages/api/group'

jest.mock('@/route/group', () => jest.fn())

describe('pages/api/group', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await group(
      //@ts-ignore
      req,
      res
    )
  })
})
