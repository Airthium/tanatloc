import { Request, Response } from 'express'

import id from '@/pages/api/project/[id]'

jest.mock('@/route/project/[id]', () => jest.fn())

describe('pages/api/project/[id]', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await id(
      //@ts-ignore
      req,
      res
    )
  })
})
