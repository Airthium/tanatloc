import { Request, Response } from 'express'

import archive from '../archive.api'

jest.mock('@/route/project/[id]/archive', () => jest.fn())

describe('pages/api/project/[id]/archive', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await archive(req, res)
  })
})
