import { Request, Response } from 'express'

import route from '../index.api'

jest.mock('@/route/organizations', () => jest.fn())

describe('pages/api/organizations', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await route(req, res)
  })
})
