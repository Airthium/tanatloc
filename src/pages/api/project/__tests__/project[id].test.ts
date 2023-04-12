import { Request, Response } from 'express'

import id from '../[id].api'

jest.mock('@/route/project/[id]', () => jest.fn())

describe('pages/api/project/[id]', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await id(req, res)
  })
})
