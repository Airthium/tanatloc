import { IRequest, IResponse } from '@/route'
import link from '@/pages/api/link'

jest.mock('@/route/link', () => jest.fn())

describe('pages/api/link', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await link(
      //@ts-ignore
      res,
      res
    )
  })
})
