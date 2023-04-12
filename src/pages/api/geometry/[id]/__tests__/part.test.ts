import { Request, Response } from 'express'

import part from '../part.api'

jest.mock('@/route/geometry/[id]/part', () => jest.fn())

describe('pages/api/geometry/[id]/part', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await part(req, res)
  })
})
