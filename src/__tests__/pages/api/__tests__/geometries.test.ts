import { Request, Response } from 'express'

import geometries from '@/pages/api/geometries'

jest.mock('@/route/geometries', () => jest.fn())

describe('pages/api/geometries', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await geometries(req, res)
  })
})
