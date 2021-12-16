import { Request, Response } from 'express'

import groups from '..'

describe('route/groups', () => {
  const req = {} as Request
  let resStatus: number
  let resJson: string | object
  const res = {} as Response
  res.status = (status: number) => {
    resStatus = status
    return res
  }
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
