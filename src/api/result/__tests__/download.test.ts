import { download } from '../download'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/result/download', () => {
  test('call', async () => {
    await download(
      { id: 'id' },
      { originPath: 'originPath', fileName: 'fileName' }
    )
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
