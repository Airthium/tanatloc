import { Request, Response } from 'express'

import copy from '../copy.api'

jest.mock('@/route/project/[id]/copy', () => jest.fn())

describe('pages/api/project/[id]/copy', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await copy(req, res)
  })
})
