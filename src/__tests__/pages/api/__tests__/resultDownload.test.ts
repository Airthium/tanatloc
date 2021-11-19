import { IRequest, IResponse } from '@/route'
import result from '@/pages/api/result/download'

jest.mock('@/route/result/download', () => jest.fn())

describe('pages/api/result/download', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await result(
      //@ts-ignore
      req,
      res
    )
  })
})
