import { IRequest, IResponse } from '@/route'
import group from '@/pages/api/group'

jest.mock('@/route/group', () => jest.fn())

describe('pages/api/group', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await group(
      //@ts-ignore
      req,
      res
    )
  })
})
