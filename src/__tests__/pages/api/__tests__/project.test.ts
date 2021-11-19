import { IRequest, IResponse } from '@/route'
import project from '@/pages/api/project'

jest.mock('@/route/project', () => jest.fn())

describe('pages/api/project', () => {
  const req: IRequest = {}
  const res: IResponse = {
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await project(
      //@ts-ignore
      req,
      res
    )
  })
})
