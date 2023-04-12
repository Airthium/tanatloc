import { Request, Response } from 'express'

import geometries from '../index.api'

jest.mock('@/route/geometries', () => jest.fn())

describe('pages/api/geometries', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await geometries(req, res)
  })
})
