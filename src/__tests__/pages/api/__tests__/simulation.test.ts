import { IRequest, IResponse } from '@/route'
import simulation from '@/pages/api/simulation'

jest.mock('@/route/simulation', () => jest.fn())

describe('pages/api/simulation', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await simulation(
      //@ts-ignore
      req,
      res
    )
  })
})
