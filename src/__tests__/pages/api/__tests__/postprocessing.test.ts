import { Request, Response } from 'express'

import postprocessing from '@/pages/api/postprocessing'

jest.mock('@/route/postprocessing', () => jest.fn())

describe('pages/api/postprocessing', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await postprocessing(req, res)
  })
})
