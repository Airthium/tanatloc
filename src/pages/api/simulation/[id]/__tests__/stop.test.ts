import { Request, Response } from 'express'

import stop from '../stop.api'

jest.mock('@/route/simulation/[id]/stop', () => () => {})

describe('pages/api/simulation/[id]/stop', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await stop(req, res)
  })
})
