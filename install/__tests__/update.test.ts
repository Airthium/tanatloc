const mockRescale = jest.fn()
jest.mock('@/updaters/rescale', () => async () => mockRescale())

describe('install/update', () => {
  test('call', async () => {
    require('../update')
    expect(mockRescale).toHaveBeenCalledTimes(1)
  })
})

export {}
