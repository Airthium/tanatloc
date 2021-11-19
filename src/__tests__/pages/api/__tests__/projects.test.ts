import { IRequest, IResponse } from '@/route'
import id from '@/pages/api/projects'

jest.mock('@/route/projects', () => jest.fn())

describe('pages/api/project', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await id(
      //@ts-ignore
      req,
      res
    )
  })
})
