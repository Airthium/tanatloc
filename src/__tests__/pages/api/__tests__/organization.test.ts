import { Request, Response } from 'express'

import route from '@/pages/api/organization'

jest.mock('@/route/organization', () => jest.fn())

describe('pages/api/organization', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await route(
      //@ts-ignore
      req,
      res
    )
  })
})
