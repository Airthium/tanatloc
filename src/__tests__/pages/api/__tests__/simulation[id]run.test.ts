import { Request, Response } from 'express'

import run from '@/pages/api/simulation/[id]/run'

jest.mock('@/route/simulation/[id]/run', () => () => {})

describe('pages/api/simulation/[id]/run', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await run(req, res)
  })
})
