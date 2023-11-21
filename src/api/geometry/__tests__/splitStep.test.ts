import { splitStep } from '../splitStep'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/geometry/splitStep', () => {
  test('call', async () => {
    await splitStep({ id: 'id' }, { id: 'id' })
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
