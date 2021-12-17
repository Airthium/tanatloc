import { Request, Response } from 'express'

import id from '@/pages/api/projects'

jest.mock('@/route/projects', () => jest.fn())

describe('pages/api/project', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await id(req, res)
  })
})
