import { Request, Response } from 'express'

import avatar from '../index.api'

jest.mock('@/route/avatar', () => jest.fn())

describe('pages/api/avatar', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await avatar(req, res)
  })
})
