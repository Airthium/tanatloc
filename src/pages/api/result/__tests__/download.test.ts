import { Request, Response } from 'express'

import result from '../download.api'

jest.mock('@/route/result/download', () => jest.fn())

describe('pages/api/result/download', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await result(req, res)
  })
})
