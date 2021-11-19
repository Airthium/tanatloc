import { IRequest, IResponse } from '@/route'
import logout from '@/pages/api/logout'

jest.mock('@/route/logout', () => ({
  logout: jest.fn()
}))

describe('pages/api/logout', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await logout(req, res)
  })
})
