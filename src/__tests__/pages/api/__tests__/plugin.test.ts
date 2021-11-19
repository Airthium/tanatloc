import { IRequest, IResponse } from '@/route'
import plugin from '@/pages/api/plugin'

jest.mock('@/route/plugin', () => jest.fn())

describe('pages/api/plugin', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await plugin(
      //@ts-ignore
      req,
      res
    )
  })
})
