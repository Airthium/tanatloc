import { IRequest, IResponse } from '@/route'
import stop from '@/pages/api/simulation/[id]/stop'

jest.mock('@/route/simulation/[id]/stop', () => () => {})

describe('pages/api/simulation/[id]/stop', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await stop(req, res)
  })
})
