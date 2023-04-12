import { Request, Response } from 'express'

import email from '..'

jest.mock('@/route/email', () => jest.fn())

describe('pages/api/email', () => {
  const req = {} as Request
  const res = {} as Response

  test('call', async () => {
    await email(req, res)
  })
})
