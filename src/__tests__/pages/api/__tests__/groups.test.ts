import { Request, Response } from 'express'

import groups from '@/pages/api/groups'

jest.mock('@/route/groups', () => jest.fn())

describe('pages/api/groups', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await groups(req, res)
  })
})