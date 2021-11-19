import { IRequest, IResponse } from '@/route'
import email from '@/pages/api/email'

jest.mock('@/route/email', () => jest.fn())

describe('pages/api/email', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await email(
      //@ts-ignore
      req,
      res
    )
  })
})
