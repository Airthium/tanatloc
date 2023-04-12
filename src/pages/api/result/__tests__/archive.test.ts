import { Request, Response } from 'express'

import result from '../archive.api'

jest.mock('@/route/result/archive', () => jest.fn())

describe('pages/api/result/archive', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await result(req, res)
  })
})
