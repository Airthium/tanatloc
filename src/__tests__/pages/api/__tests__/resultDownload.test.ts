import { Request, Response } from 'express'

import result from '@/pages/api/result/download'

jest.mock('@/route/result/download', () => jest.fn())

describe('pages/api/result/download', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await result(req, res)
  })
})
