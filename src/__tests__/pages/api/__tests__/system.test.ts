import { Request, Response } from 'express'

import system from '@/pages/api/system'

jest.mock('@/route/system', () => jest.fn())

describe('pages/api/system', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await system(
      //@ts-ignore
      req,
      res
    )
  })
})
