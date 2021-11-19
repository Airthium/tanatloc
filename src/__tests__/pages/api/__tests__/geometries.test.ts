import { IRequest, IResponse } from '@/route'
import geometries from '@/pages/api/geometries'

jest.mock('@/route/geometries', () => jest.fn())

describe('pages/api/geometries', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await geometries(
      //@ts-ignore
      req,
      res
    )
  })
})
