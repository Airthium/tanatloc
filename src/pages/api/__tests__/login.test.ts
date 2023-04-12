import { Request, Response } from 'express'

import login from '../login'

jest.mock('@/route/login', () => jest.fn())

describe('pages/api/login', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await login(req, res)
  })
})
