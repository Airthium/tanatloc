import { Request, Response } from 'express'

import system from '../index.api'

jest.mock('@/route/system', () => jest.fn())

describe('pages/api/system', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await system(req, res)
  })
})
