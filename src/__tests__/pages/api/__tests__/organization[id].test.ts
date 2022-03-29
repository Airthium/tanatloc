import { Request, Response } from 'express'

import route from '@/pages/api/organization/[id]'

jest.mock('@/route/organization/[id]', () => jest.fn())

describe('pages/api/organization/[id]', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await route(req, res)
  })
})
