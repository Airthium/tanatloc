import { IRequest, IResponse } from '@/route'
import avatar from '@/pages/api/avatar'

jest.mock('@/route/avatar', () => jest.fn())

describe('pages/api/avatar', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await avatar(
      //@ts-ignore
      req,
      res
    )
  })
})
