import { Request, Response } from 'express'

import plugins from '..'

jest.mock('@/route/plugins', () => jest.fn())

describe('pages/api/plugins', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await plugins(req, res)
  })
})
