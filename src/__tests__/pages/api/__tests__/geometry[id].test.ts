import { IRequest, IResponse } from '@/route'
import id from '@/pages/api/geometry/[id]'

jest.mock('@/route/geometry/[id]', () => jest.fn())

describe('pages/api/geometry/[id]', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await id(
      //@ts-ignore
      req,
      res
    )
  })
})
