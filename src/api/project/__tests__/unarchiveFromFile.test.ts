import { unarchiveFromFile } from '../unarchiveFromFile'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/project/unarchiveFromFile', () => {
  test('call', async () => {
    await unarchiveFromFile({ id: 'id' }, Buffer.from('buffer'))
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
