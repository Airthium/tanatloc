import { IRequest, IResponse } from '@/route'
import log from '@/pages/api/simulation/[id]/log'

jest.mock('@/route/simulation/[id]/log', () => () => {})

describe('pages/api/simulation/[id]/log', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await log(
      //@ts-ignore
      req,
      res
    )
  })
})
