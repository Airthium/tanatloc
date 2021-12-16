import { Request, Response } from 'express'

import project from '@/pages/api/project'

jest.mock('@/route/project', () => jest.fn())

describe('pages/api/project', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await project(
      //@ts-ignore
      req,
      res
    )
  })
})
