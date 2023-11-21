import { Request, Response } from 'express'

import splitStep from '../splitStep.api'

jest.mock('@/route/geometry/[id]/splitStep', () => jest.fn())

describe('pages/api/geometry/[id]/splitStep', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await splitStep(req, res)
  })
})
