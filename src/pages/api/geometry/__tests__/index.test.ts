import { Request, Response } from 'express'

import geometry from '../index.api'

jest.mock('@/route/geometry', () => jest.fn())

describe('pages/api/geometry', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await geometry(req, res)
  })
})
