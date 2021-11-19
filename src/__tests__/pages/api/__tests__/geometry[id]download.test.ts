import { IRequest, IResponse } from '@/route'
import download from '@/pages/api/geometry/[id]/download'

jest.mock('@/route/geometry/[id]/download', () => jest.fn())

describe('pages/api/geometry/[id]/download', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await download(req, res)
  })
})
