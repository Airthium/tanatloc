import { IRequest, IResponse } from '@/route'
import groups from '..'

describe('route/groups', () => {
  const req: IRequest = {}
  let resStatus: number
  let resJson: any
  const res: IResponse = {
    setHeader: jest.fn,
    status: (status: number) => {
      resStatus = status
      return res
    },
    end: () => {
      resJson = 'end'
      return res
    },
    json: (value: object) => {
      resJson = value
      return res
    }
  }

  test('call', async () => {
    await groups(req, res)
    expect(resJson).toEqual({ groups: [] })
  })
})
