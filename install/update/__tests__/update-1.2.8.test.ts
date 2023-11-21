import update from '../update-1.2.8'

const mockQuery = jest.fn()
const mockUpdater = jest.fn()
jest.mock('@/database', () => ({
  query: async () => mockQuery(),
  updater: async () => mockUpdater()
}))

describe('install/update/1.2.8', () => {
  beforeEach(() => {
    mockQuery.mockReset()
    mockUpdater.mockReset()
  })

  test('normal', async () => {
    mockQuery.mockImplementation(() => ({
      rows: [
        {
          models: [{ user: 'id' }, {}],
          templates: ['t1', 't2']
        }
      ]
    }))
    await update()
    expect(mockQuery).toHaveBeenCalledTimes(3)
    expect(mockUpdater).toHaveBeenCalledTimes(4)
  })

  test('length mismatch', async () => {
    mockQuery.mockImplementation(() => ({
      rows: [
        {
          models: [{}, {}],
          templates: ['t1']
        }
      ]
    }))
    await update()
    expect(mockQuery).toHaveBeenCalledTimes(1)
    expect(mockUpdater).toHaveBeenCalledTimes(0)
  })

  test('error', async () => {
    mockQuery.mockImplementation(() => {
      throw new Error('query error')
    })
    await update()
  })
})
