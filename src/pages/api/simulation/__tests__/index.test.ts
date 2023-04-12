import { Request, Response } from 'express'

import simulation from '..'

jest.mock('@/route/simulation', () => jest.fn())

describe('pages/api/simulation', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await simulation(req, res)
  })
})
