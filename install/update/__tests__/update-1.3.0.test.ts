import update from '../update-1.3.0'

const mockQuery = jest.fn()
const mockUpdater = jest.fn()
jest.mock('@/database', () => ({
  query: async () => mockQuery(),
  updater: async () => mockUpdater()
}))

describe('install/update/1.3.0', () => {
  beforeEach(() => {
    mockQuery.mockReset()
    mockUpdater.mockReset()
  })

  test('normal', async () => {
    mockQuery.mockImplementation(() => ({
      rows: [
        {
          scheme: {
            configuration: {
              geometry: {
                meshable: true,
                value: 'value'
              }
            }
          }
        },
        {
          scheme: {
            configuration: {
              geometry: {
                meshable: false,
                multiple: true,
                values: ['value', 'value']
              }
            }
          }
        }
      ]
    }))
    await update()
    expect(mockQuery).toHaveBeenCalledTimes(1)
    expect(mockUpdater).toHaveBeenCalledTimes(2)
  })

  test('error', async () => {
    mockQuery.mockImplementation(() => {
      throw new Error('query error')
    })
    await update()
  })
})
