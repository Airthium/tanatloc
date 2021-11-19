import { IRequest, IResponse } from '@/route'
import tasks from '@/pages/api/simulation/[id]/tasks'

jest.mock('@/route/simulation/[id]/tasks', () => () => {})

describe('pages/api/simulation/[id]/tasks', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await tasks(req, res)
  })
})
