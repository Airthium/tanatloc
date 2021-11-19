import { IRequest, IResponse } from '@/route'
import workspace from '@/pages/api/workspace'

jest.mock('@/route/workspace', () => jest.fn())

describe('pages/api/workspace', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await workspace(
      //@ts-ignore
      req,
      res
    )
  })
})
