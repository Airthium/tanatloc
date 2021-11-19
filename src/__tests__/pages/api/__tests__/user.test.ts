import { IRequest, IResponse } from '@/route'
import user from '@/pages/api/user'

jest.mock('@/route/user', () => jest.fn())

describe('pages/api/user', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await user(
      //@ts-ignore
      req,
      res
    )
  })
})
