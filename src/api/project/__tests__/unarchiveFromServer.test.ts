import { unarchiveFromServer } from '../unarchiveFromServer'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/project/unarchiveFromServer', () => {
  test('call', async () => {
    await unarchiveFromServer({ id: 'id' })
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
