import { IRequest, IResponse } from '@/route'
import run from '@/pages/api/simulation/[id]/run'

jest.mock('@/route/simulation/[id]/run', () => () => {})

describe('pages/api/simulation/[id]/run', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await run(req, res)
  })
})
