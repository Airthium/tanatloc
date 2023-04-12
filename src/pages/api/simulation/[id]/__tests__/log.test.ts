import { Request, Response } from 'express'

import log from '../log.api'

jest.mock('@/route/simulation/[id]/log', () => () => {})

describe('pages/api/simulation/[id]/log', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await log(req, res)
  })
})
