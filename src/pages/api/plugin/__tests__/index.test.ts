import { Request, Response } from 'express'

import plugin from '../index.api'

jest.mock('@/route/plugin', () => jest.fn())

describe('pages/api/plugin', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await plugin(req, res)
  })
})
