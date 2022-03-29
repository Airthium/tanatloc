import { deleteArchiveFile } from '../deleteArchiveFile'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/project/deleteArchiveFile', () => {
  test('call', async () => {
    await deleteArchiveFile({ id: 'id' })
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
