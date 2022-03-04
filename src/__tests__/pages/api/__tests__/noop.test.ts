import { Request, Response } from 'express'

import noop from '@/pages/api/noop'

describe('pages/api/noop', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await noop(req, res)
  })
})
