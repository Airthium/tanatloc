import { Request, Response } from 'express'

import groups from '..'

describe('route/groups', () => {
  const req = {} as Request
  let resJson: string | object
  const res = {} as Response
  res.status = () => res
  res.end = () => {
    resJson = 'end'
    return res
  }
  res.json = (value: object) => {
    resJson = value
    return res
  }

  test('call', async () => {
    await groups(req, res)
    expect(resJson).toEqual({ groups: [] })
  })
})
