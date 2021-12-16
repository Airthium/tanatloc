import { Request, Response } from 'express'

import plugin from '@/pages/api/plugin'

jest.mock('@/route/plugin', () => jest.fn())

describe('pages/api/plugin', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await plugin(
      //@ts-ignore
      req,
      res
    )
  })
})
