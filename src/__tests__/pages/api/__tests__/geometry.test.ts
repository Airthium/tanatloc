import { Request, Response } from 'express'

import geometry from '@/pages/api/geometry'

jest.mock('@/route/geometry', () => jest.fn())

describe('pages/api/geometry', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await geometry(
      //@ts-ignore
      req,
      res
    )
  })
})
