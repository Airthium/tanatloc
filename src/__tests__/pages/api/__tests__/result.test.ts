import { Request, Response } from 'express'

import result from '@/pages/api/result'

jest.mock('@/route/result', () => jest.fn())

describe('pages/api/result', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await result(
      //@ts-ignore
      req,
      res
    )
  })
})
