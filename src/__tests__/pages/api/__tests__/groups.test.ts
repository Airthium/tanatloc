import { IRequest, IResponse } from '@/route'
import groups from '@/pages/api/groups'

jest.mock('@/route/groups', () => jest.fn())

describe('pages/api/groups', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await groups(req, res)
  })
})
