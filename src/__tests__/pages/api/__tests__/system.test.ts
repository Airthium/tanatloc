import { IRequest, IResponse } from '@/route'
import system from '@/pages/api/system'

jest.mock('@/route/system', () => jest.fn())

describe('pages/api/system', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await system(
      //@ts-ignore
      req,
      res
    )
  })
})
