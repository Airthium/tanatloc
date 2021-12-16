import { Request, Response } from 'express'

import workspace from '@/pages/api/workspace'

jest.mock('@/route/workspace', () => jest.fn())

describe('pages/api/workspace', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await workspace(
      //@ts-ignore
      req,
      res
    )
  })
})
