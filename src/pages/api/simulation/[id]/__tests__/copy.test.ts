import { Request, Response } from 'express'

import copy from '../copy.api'

jest.mock('@/route/simulation/[id]/copy', () => () => {})

describe('pages/api/simulation/[id]/copy', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await copy(req, res)
  })
})
