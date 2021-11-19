import { IRequest, IResponse } from '@/route'
import id from '@/pages/api/groups/[id]'

jest.mock('@/route/groups/[id]', () => jest.fn())

describe('pages/api/groups/[id]', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await id(req, res)
  })
})
