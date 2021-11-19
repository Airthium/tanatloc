import { IRequest, IResponse } from '@/route'
import geometry from '@/pages/api/geometry'

jest.mock('@/route/geometry', () => jest.fn())

describe('pages/api/geometry', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await geometry(
      //@ts-ignore
      req,
      res
    )
  })
})
