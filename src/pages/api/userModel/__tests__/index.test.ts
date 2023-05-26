import { Request, Response } from 'express'

import userModel from '../index.api'

jest.mock('@/route/userModel', () => jest.fn())

describe('pages/api/userModel', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await userModel(req, res)
  })
})
