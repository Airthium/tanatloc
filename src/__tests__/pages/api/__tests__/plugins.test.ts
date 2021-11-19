import { IRequest, IResponse } from '@/route'
import plugins from '@/pages/api/plugins'

jest.mock('@/route/plugins', () => jest.fn())

describe('pages/api/plugins', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await plugins(req, res)
  })
})
