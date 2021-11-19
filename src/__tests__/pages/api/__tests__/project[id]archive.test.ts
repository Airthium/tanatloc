import { WriteStream } from 'fs'

import { IRequest, IResponse } from '@/route'
import archive from '@/pages/api/project/[id]/archive'

jest.mock('@/route/project/[id]/archive', () => jest.fn())

describe('pages/api/project/[id]/archive', () => {
  const req: IRequest = {}
  const res: IResponse & WriteStream = {
    ...WriteStream.constructor(),
    setHeader: jest.fn,
    status: () => res,
    end: () => res,
    json: () => res
  }

  test('call', async () => {
    await archive(req, res)
  })
})
