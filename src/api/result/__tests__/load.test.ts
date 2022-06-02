import { load } from '../load'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/result/load', () => {
  test('call', async () => {
    await load({ id: 'id' }, { originPath: 'originPath', glb: 'glb' })
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
