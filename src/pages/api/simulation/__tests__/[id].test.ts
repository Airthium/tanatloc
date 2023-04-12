import { Request, Response } from 'express'

import id from '../[id]'

jest.mock('@/route/simulation/[id]', () => jest.fn())

describe('pages/api/simulation/[id]', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await id(req, res)
  })
})
