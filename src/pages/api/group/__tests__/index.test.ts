import { Request, Response } from 'express'

import group from '../index.api'

jest.mock('@/route/group', () => jest.fn())

describe('pages/api/group', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await group(req, res)
  })
})
