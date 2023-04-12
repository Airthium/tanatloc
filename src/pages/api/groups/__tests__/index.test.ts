import { Request, Response } from 'express'

import groups from '../index.api'

jest.mock('@/route/groups', () => jest.fn())

describe('pages/api/groups', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await groups(req, res)
  })
})
