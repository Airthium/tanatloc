import { IRequest, IResponse } from '@/route'
import route from '@/pages/api/organizations'

jest.mock('@/route/organizations', () => jest.fn())

describe('pages/api/organizations', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await route(req, res)
  })
})
