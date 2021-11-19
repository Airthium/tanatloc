import { IRequest, IResponse } from '@/route'
import part from '@/pages/api/geometry/[id]/part'

jest.mock('@/route/geometry/[id]/part', () => jest.fn())

describe('pages/api/geometry/[id]/part', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await part(req, res)
  })
})
