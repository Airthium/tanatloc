import update from '../update'

const mockRescale = jest.fn()
jest.mock('@/updaters/rescale', () => async () => mockRescale())

describe('install/update', () => {
  test('call', async () => {
    await update()
    expect(mockRescale).toHaveBeenCalledTimes(1)
  })
})
