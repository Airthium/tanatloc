import { IRequest, IResponse } from '@/route'
import id from '@/pages/api/simulation/[id]'

jest.mock('@/route/simulation/[id]', () => jest.fn())

describe('pages/api/simulation/[id]', () => {
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
