import { IRequest, IResponse } from '@/route'
import simulations from '@/pages/api/simulations'

jest.mock('@/route/simulations', () => jest.fn())

describe('pages/api/simulations', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await simulations(
      //@ts-ignore
      req,
      res
    )
  })
})
