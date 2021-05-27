import System from '../'

const mockGet = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/database/system', () => ({
  get: async () => mockGet(),
  update: async () => mockUpdate()
}))

describe('lib/system', () => {
  test('get', async () => {
    await System.get()
    expect(mockGet).toHaveBeenCalledTimes(1)
  })

  test('update', async () => {
    await System.update()
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })
})
