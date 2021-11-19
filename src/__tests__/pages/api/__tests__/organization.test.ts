import { IRequest, IResponse } from '@/route'
import route from '@/pages/api/organization'

jest.mock('@/route/organization', () => jest.fn())

describe('pages/api/organization', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await route(
      //@ts-ignore
      req,
      res
    )
  })
})
