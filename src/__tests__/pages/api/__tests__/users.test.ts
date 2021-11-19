import { IRequest, IResponse } from '@/route'
import users from '@/pages/api/users'

jest.mock('@/route/users', () => jest.fn())

describe('pages/api/users', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await users(req, res)
  })
})
