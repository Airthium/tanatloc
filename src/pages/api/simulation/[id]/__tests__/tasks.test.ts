import { Request, Response } from 'express'

import tasks from '../tasks'

jest.mock('@/route/simulation/[id]/tasks', () => () => {})

describe('pages/api/simulation/[id]/tasks', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await tasks(req, res)
  })
})
