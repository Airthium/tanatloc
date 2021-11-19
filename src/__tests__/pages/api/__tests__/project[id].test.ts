import { IRequest, IResponse } from '@/route'
import id from '@/pages/api/project/[id]'

jest.mock('@/route/project/[id]', () => jest.fn())

describe('pages/api/project/[id]', () => {
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
