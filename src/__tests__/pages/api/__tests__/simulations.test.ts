import { Request, Response } from 'express'

import simulations from '@/pages/api/simulations'

jest.mock('@/route/simulations', () => jest.fn())

describe('pages/api/simulations', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await simulations(req, res)
  })
})
