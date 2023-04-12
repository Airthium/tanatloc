import { Request, Response } from 'express'

import result from '../index.api'

jest.mock('@/route/result', () => jest.fn())

describe('pages/api/result', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await result(req, res)
  })
})
