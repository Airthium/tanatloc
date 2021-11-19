import { IRequest, IResponse } from '@/route'
import login from '@/pages/api/login'

jest.mock('@/route/login', () => jest.fn())

describe('pages/api/login', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await login(req, res)
  })
})
