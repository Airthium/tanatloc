import { Request, Response } from 'express'

import link from '@/pages/api/link'

jest.mock('@/route/link', () => jest.fn())

describe('pages/api/link', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await link(
      //@ts-ignore
      res,
      res
    )
  })
})
