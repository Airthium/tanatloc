import { Request, Response } from 'express'

import users from '../index.api'

jest.mock('@/route/users', () => jest.fn())

describe('pages/api/users', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await users(req, res)
  })
})
