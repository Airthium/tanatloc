import { Request, Response } from 'express'

import link from '..'

jest.mock('@/route/link', () => jest.fn())

describe('pages/api/link', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await link(req, res)
  })
})
