import { Request, Response } from 'express'

import id from '@/pages/api/geometry/[id]'

jest.mock('@/route/geometry/[id]', () => jest.fn())

describe('pages/api/geometry/[id]', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await id(req, res)
  })
})
