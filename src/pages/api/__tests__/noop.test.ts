import { Request, Response } from 'express'

import noop from '../noop'

describe('pages/api/noop', () => {
  const req = {} as Request
  const res = {} as Response
  res.status = jest.fn().mockImplementation(() => ({
    end: jest.fn()
  }))

  test('call', async () => {
    await noop(req, res)
  })
})
